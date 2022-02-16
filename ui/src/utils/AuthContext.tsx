import * as React from "react";

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
  if (!authContext) {
    throw new Error("useAuthActions must be used within an AuthContext");
  }
  const { setState } = authContext;
  return React.useMemo(
    () => ({
      setToken: (token) => setState({ token }),
      logout: () => setState(null),
    }),
    [setState]
  );
}

export function AuthContextProvider({
  children,
}: {
  children?: React.ReactNode;
}): React.ReactElement {
  const [currentState, setState] = React.useState<AuthState | null>(null);

  const value: AuthContextValue = React.useMemo(
    () => ({
      currentState,
      setState,
    }),
    [currentState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
