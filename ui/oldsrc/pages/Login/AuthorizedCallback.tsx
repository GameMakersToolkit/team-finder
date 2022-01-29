import * as React from "react";
import jwtDecode from "jwt-decode";
import { PageHeader } from "../../../oldsrc/components/PageHeader";
import { useLocation } from "react-router-dom";
import { UserInfo } from "../../utils/UserInfo";

interface AssumedTokenType {
  aud: string;
  sub: string;
}

export const AuthorizedCallback: React.FC = () => {
    const query = new URLSearchParams(useLocation().search)
    const token = query.get("token")
    if (token == null) {
      return (<>
        <PageHeader>Error</PageHeader>
        <div>Should show error page</div>
      </>)
    }

    const rawUserData = jwtDecode(token) as AssumedTokenType;

    // .sub and .aud shouldn't be long-lived, as this is a misuse of claims
    // Expect these to change before long
    const userInfo: UserInfo = {
      avatar:   rawUserData.aud,
      username: rawUserData.sub,
      id: "here-for-linting-test",
      discriminator: "here-for-linting-test",
      is_in_guild: false
    };

    localStorage.setItem("token", token)
    localStorage.setItem("userData", JSON.stringify(userInfo))

    // Redirect to homepage, we don't need to stay here!
    window.location.replace("/register");

    return null
}
