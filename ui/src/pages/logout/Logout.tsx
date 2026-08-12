import * as React from "react";
import {useAuth, useAuthActions} from "../../api/AuthContext";
import {useSearchParams} from "react-router-dom";

export function Logout(): null {
    const [searchParams] = useSearchParams()
    const jamId = searchParams.get("redirect") || "*"
    const auth = useAuth(jamId);
    const { logout } = useAuthActions();

    React.useEffect(() => {
        if (!auth) {
            return;
        }

        const token = auth.token;
        void fetch(`${import.meta.env.VITE_API_URL}/logout`, {
            method: "POST",
            mode: "cors",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).finally(() => {
            logout(jamId);
            window.location.replace(`/${jamId}`); // Do a browser movement to refresh page and reload userInfo
        });
    }, [auth, jamId, logout]);

    return null;
}
