import * as React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthActions } from "../../api/AuthContext";
import { getJamId } from "../../common/utils/getJamId.ts";

export function Callback(): React.ReactElement | null {
    const { setToken } = useAuthActions();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const jamId = getJamId();
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
