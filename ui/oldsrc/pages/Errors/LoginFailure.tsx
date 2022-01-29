import * as React from "react";
import {loginUrl} from "../Login/Login";

export const LoginFailure: React.FC = () => {
  return (<>
    <p>Sorry, we couldn&#39;t authenticate you against Discord</p>
    <p>
      <a href={loginUrl}>
        Please try again, or contact the developers if you keep seeing this issue.
      </a>
    </p>
  </>)
}
