import * as React from "react";
import { useQueryClient } from '@tanstack/react-query';
import { getJamId } from "../common/utils/getJamId.ts";
import {
  safeGetString,
  safeRemoveItem,
  safeSetString,
} from "../common/utils/storageUtils.ts";

const LOCAL_STORAGE_KEY = "team_finder_auth";

export interface AuthContextValue {
  currentState: AuthState | null;
  setState: (state: AuthState | null) => void;
}

export interface AuthState {
  token: string;
}

export interface AuthActions {
  setToken: (jamId: string, token: string) => void;
  logout: (jamId: string) => void;
}

export const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

export function useAuth(overrideJamId?: string): AuthState | null {
  const jamId = overrideJamId ?? getJamId()

  const authContext = React.useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthContext");
  }

  const token = safeGetString(`${LOCAL_STORAGE_KEY}:${jamId}`);
  return token ? { token } : null;
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
      setToken: (jamId: string, token: string) => {
        safeSetString(`${LOCAL_STORAGE_KEY}:${jamId}`, token);
        setState({ token });
      },
      logout: (jamId: string) => {
        if (jamId === "*") {
            Object.keys(localStorage).forEach((key) => {
                if (key.startsWith(LOCAL_STORAGE_KEY)) {
                    safeRemoveItem(key);
                }
            });
        } else {
            safeRemoveItem(`${LOCAL_STORAGE_KEY}:${jamId}`);
        }
        setState(null);
        queryClient.invalidateQueries();
      },
    }),
    [setState, queryClient]
  );
}

export function AuthContextProvider({
  children,
}: {
  children?: React.ReactNode;
}): React.ReactElement {
  const jamId = getJamId()
  const [currentState, setAuthState] = React.useState<AuthState | null>(
    () => {
        const key = `${LOCAL_STORAGE_KEY}:${jamId}`
        const existingToken = safeGetString(key);
        return existingToken ? { token: existingToken } : null;
    }
  );

  const value: AuthContextValue = React.useMemo(
    () => ({
      currentState,
      setState: (state: AuthState | null) => setAuthState(state),
    }),
    [currentState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
