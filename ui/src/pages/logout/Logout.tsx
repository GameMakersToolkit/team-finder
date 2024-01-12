import * as React from "react";
import {useAuth, useAuthActions} from "../../api/AuthContext";

export function Logout(): null {
    const auth = useAuth();
    const { logout } = useAuthActions();

    React.useEffect(() => {
        if (auth) {
            logout();
            window.location.replace("/"); // Do a browser movement to refresh page and reload userInfo
        }
    }, [auth, logout]);

    return null;
}
