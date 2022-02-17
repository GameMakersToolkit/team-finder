import * as React from "react";
import { useUserInfo } from "../../queries/userInfo";
import { useAuth } from "../../utils/AuthContext";
import { importMetaEnv } from "../../utils/importMeta";

export const loginUrl = `${importMetaEnv().VITE_API_URL}/login`;

export function TestAuthenticatedPage(): React.ReactElement | null {
  const auth = useAuth();
  const userInfo = useUserInfo();

  React.useEffect(() => {
    if (!auth) {
      window.location.href = loginUrl;
    }
  }, [auth]);

  if (!auth) {
    return null;
  }

  return (
    <>
      <div>are ya logged in</div>
      {userInfo.data && <pre>{JSON.stringify(userInfo.data, null, 2)}</pre>}
    </>
  );
}
