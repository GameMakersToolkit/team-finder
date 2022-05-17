import * as React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthActions } from "../../utils/AuthContext";
import { LOCAL_STORAGE_RETURN_AUTH_PATH_KEY } from "../../utils/login";

export function AuthCallback(): React.ReactElement | null {
  const { setToken } = useAuthActions();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  React.useEffect(() => {
    if (token) {
      setToken(token);

      navigate(localStorage.getItem(LOCAL_STORAGE_RETURN_AUTH_PATH_KEY) || "/", {replace: true});
    }
  }, [navigate, setToken, token]);

  if (token) {
    return null;
  } else {
    return <p>Error: Couldn{"'"}t log in. Please try again.</p>;
  }
}
