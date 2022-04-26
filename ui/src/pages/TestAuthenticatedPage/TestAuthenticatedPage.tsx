import * as React from "react";
import { StyledSelector } from "../../components/StyledSelector/StyledSelector";
import { useEnsureLoggedIn } from "../../utils/useEnsureLoggedIn";

export function TestAuthenticatedPage(): React.ReactElement | null {
  const userInfo = useEnsureLoggedIn();

  if (!userInfo.data) {
    return null;
  }

  return (
    <>
      <pre>{JSON.stringify(userInfo.data, null, 2)}</pre>
      <div className="container mx-auto">
        <StyledSelector />
      </div>
    </>
  );
}
