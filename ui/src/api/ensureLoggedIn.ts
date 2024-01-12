import * as React from "react";
import { useUserInfo } from "./userInfo";
import { useAuth } from "./AuthContext";
import { login } from "./login";

/**
 * Note: While this does automatically redirect the user to the login page
 * if they aren't logged in, it doesn't _guarantee_ that the user will be
 * logged in or that there will be an auth token during the initial render.
 * @returns Same as useUserInfo()
 */
export function useEnsureLoggedIn(): ReturnType<typeof useUserInfo> {
    const auth = useAuth();
    const userInfo = useUserInfo();

    React.useEffect(() => {
        if (!auth) {
            login();
        }
    }, [auth]);

    return userInfo;
}
