import * as React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthActions } from "../../api/AuthContext";
import { LOGIN_LAST_KNOWN_JAM_KEY } from "../../api/login.ts";

export function Callback(): React.ReactElement | null {
    const { setToken } = useAuthActions();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // getJamId() won't work here
    const jamId = localStorage.getItem(LOGIN_LAST_KNOWN_JAM_KEY)!!;
    const token = searchParams.get("token");

    if (token) {
        setToken(jamId, token);
        navigate(`/${jamId}`, {replace: true});
    }

    if (token) {
        return null;
    } else {
        return <p>Error: Couldn{"'"}t log in. Please try again.</p>;
    }
}
