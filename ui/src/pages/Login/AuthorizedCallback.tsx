import * as React from "react";
import { PageHeader } from "../../components/PageHeader";
import { useLocation } from "react-router-dom";
import { makeApiRequest } from "../../utils/ApiRequest";

export const AuthorizedCallback: React.FC = () => {
    const query = new URLSearchParams(useLocation().search)
    const token = query.get("token")
    if (token == null) {
      return (<>
        <PageHeader>Error</PageHeader>
        <div>Should show error page</div>
      </>)
    }

    localStorage.setItem("token", token)

    getUserInfo().then(async res => {
        // TODO: Actually cast data, instead of capture everything
        const userInfo = await res.json()
        localStorage.setItem("userData", JSON.stringify(userInfo))

        // Redirect to homepage, we don't need to stay here!
        return window.location.replace("/register");
    })

    // I don't understand React enough to not need to do this
    return (<p>Please wait...</p>)
}

export const getUserInfo = async (): Promise<Response> => {
    return await makeApiRequest("/userinfo", "GET")
};
