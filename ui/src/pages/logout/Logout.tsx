import * as React from "react";
import {useAuth, useAuthActions} from "../../api/AuthContext";
import {useSearchParams} from "react-router-dom";

export function Logout(): null {
    const [searchParams] = useSearchParams()
    const auth = useAuth();
    const { logout } = useAuthActions();
    const jamId = searchParams.get("redirect")

    React.useEffect(() => {
        if (auth) {
            logout();
            window.location.replace(`/${jamId}`); // Do a browser movement to refresh page and reload userInfo
        }
    }, [auth, logout]);

    return null;
}
