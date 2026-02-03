import * as React from "react";
import {useAuth, useAuthActions} from "../../api/AuthContext";
import {useSearchParams} from "react-router-dom";

export function Logout(): null {
    const [searchParams] = useSearchParams()
    const jamId = searchParams.get("redirect") || "*"
    const auth = useAuth(jamId);
    const { logout } = useAuthActions();

    React.useEffect(() => {
        if (auth) {
            logout(jamId);
            window.location.replace(`/${jamId}`); // Do a browser movement to refresh page and reload userInfo
        }
    }, [auth, logout]);

    return null;
}
