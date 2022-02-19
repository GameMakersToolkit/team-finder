import * as React from "react";
import { useQueryClient } from "react-query";
import { importMetaEnv } from "./importMeta";

export const LOGIN_URL = `${importMetaEnv().VITE_API_URL}/login`;

const LOCAL_STORAGE_KEY = "gmtkjam_auth";

export interface AuthContextValue {
  currentState: AuthState | null;
  setState: (state: AuthState | null) => void;
  persistToLocalStorage: boolean;
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
  const { persistToLocalStorage } = authContext;
  return React.useMemo(
    () => ({
      setToken: (token) => {
        if (persistToLocalStorage) {
          localStorage.setItem(LOCAL_STORAGE_KEY, token);
        }
        setState({ token });
      },
      logout: () => {
        if (persistToLocalStorage) {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
        setState(null);
        queryClient.invalidateQueries();
      },
    }),
    [setState, queryClient, persistToLocalStorage]
  );
}

export function AuthContextProvider({
  children,
  initialToken,
  persistToLocalStorage = true,
}: {
  children?: React.ReactNode;
  initialToken?: string;
  persistToLocalStorage?: boolean;
}): React.ReactElement {
  const [currentState, setState] = React.useState<AuthState | null>(() => {
    if (initialToken) {
      return { token: initialToken };
    }
    if (persistToLocalStorage) {
      const existingToken = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (existingToken) {
        return { token: existingToken };
      }
    }
    return null;
  });

  const value: AuthContextValue = React.useMemo(
    () => ({
      currentState,
      setState,
      persistToLocalStorage,
    }),
    [currentState, persistToLocalStorage]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
