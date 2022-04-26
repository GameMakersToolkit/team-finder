import * as React from "react";
import { useEnsureLoggedIn } from "../../utils/useEnsureLoggedIn";

export function TestAuthenticatedPage(): React.ReactElement | null {
  const userInfo = useEnsureLoggedIn();

  if (!userInfo.data) {
    return null;
  }

  return (
    <>
      <pre>{JSON.stringify(userInfo.data, null, 2)}</pre>
    </>
  );
}
