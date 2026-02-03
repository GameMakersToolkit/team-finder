import * as React from "react";
import { useQueryClient } from '@tanstack/react-query';

const LOCAL_STORAGE_KEY = "team_finder_auth";

export interface AuthContextValue {
  currentState: AuthState | null;
  setState: (state: AuthState | null) => void;
}

export interface AuthState {
  token: string;
}

export interface AuthActions {
  setToken: (token: string) => void;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

export function useAuth(): AuthState | null {
  const authContext = React.useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthContext");
  }
  return authContext.currentState;
}

export function useAuthActions(): AuthActions {
  const authContext = React.useContext(AuthContext);
  const queryClient = useQueryClient();
  if (!authContext) {
    throw new Error("useAuthActions must be used within an AuthContext");
  }
  const { setState } = authContext;
  return React.useMemo(
    () => ({
      setToken: (token) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, token);
        setState({ token });
      },
      logout: () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setState(null);
        queryClient.invalidateQueries();
      },
    }),
    [setState, queryClient]
  );
}

export function AuthContextProvider({
  children,
  initialToken,
}: {
  children?: React.ReactNode;
  initialToken?: string;
}): React.ReactElement {
  const [currentState, setState] = React.useState<AuthState | null>(() => {
    if (initialToken) {
      return { token: initialToken };
    }
    const existingToken = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (existingToken) {
      return { token: existingToken };
    }
    return null;
  });

  const value: AuthContextValue = React.useMemo(
    () => ({
      currentState,
      setState,
    }),
    [currentState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
