import * as React from "react";
import { useUserInfo } from "../../queries/userInfo";
import { LOGIN_URL, useAuth } from "../../utils/AuthContext";

export function TestAuthenticatedPage(): React.ReactElement | null {
  const auth = useAuth();
  const userInfo = useUserInfo();

  React.useEffect(() => {
    if (!auth) {
      window.location.href = LOGIN_URL;
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
