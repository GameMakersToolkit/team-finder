const LOGIN_URL = `${import.meta.env.VITE_API_URL}/login`;

export const LOCAL_STORAGE_RETURN_AUTH_PATH_KEY = "auth_redirect_path";

export const login = () => {
    localStorage.setItem(LOCAL_STORAGE_RETURN_AUTH_PATH_KEY, window.location.pathname);
    window.location.href = LOGIN_URL;
}
