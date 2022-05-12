import React from "react";
import { useUserInfo } from "../../../queries/userInfo";
import { useAuth } from "../../../utils/AuthContext";

export const Onboarding: React.FC = () => {
    const isLoggedIn = Boolean(useAuth());

    const userInfo = useUserInfo();
    if (userInfo.isLoading) return (<p><b>ONBOARDING [?/4]:</b> Loading...</p>)

    const userIsInDiscordServer = userInfo.data?.isInDiscordServer;
    const userHasContactPermsSet = userInfo.data?.hasContactPermsSet;

    if (!isLoggedIn) return (<p><b>ONBOARDING [1/4]:</b> User needs to log in</p>)

    if (!userIsInDiscordServer) return (<p><b>ONBOARDING [2/4]:</b> User needs to join server</p>)

    if (!userHasContactPermsSet) return (<p><b>ONBOARDING [3/4]:</b> User needs to set perms</p>)

    return (<p><b>ONBOARDING:</b> User has done all onboarding steps</p>)
}