import * as React from "react";
import { useAuth } from "../../utils/AuthContext";
import { importMetaEnv } from "../../utils/importMeta";

export const loginUrl = `${importMetaEnv().VITE_API_URL}/login`;

export function TestAuthenticatedPage(): React.ReactElement | null {
  const auth = useAuth();

  React.useEffect(() => {
    if (!auth) {
      window.location.href = loginUrl;
    }
  }, [auth]);

  if (!auth) {
    return null;
  }

  return <div>are ya logged in</div>;
}
