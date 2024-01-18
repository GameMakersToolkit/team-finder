import React from "react";
import {useAuth} from "../../../api/AuthContext.tsx";
import {useUserInfo} from "../../../api/userInfo.ts";
import {login} from "../../../api/login.ts";

const discordGroupName = import.meta.env.VITE_DISCORD_NAME;
const discordGroupInviteUrl = import.meta.env.VITE_DISCORD_INVITE_URL;

export const Onboarding: React.FC = () => {
    const isLoggedIn = Boolean(useAuth());
    const userInfo = useUserInfo();
    const userIsInDiscordServer = userInfo.data?.isInDiscordServer;

    if (userInfo.isLoading) {
        return null
    }

    if (!isLoggedIn) {
        return (
            <div className="c-onboarding-info-box">
                <p className="text-white">
                    <a onClick={login} className="font-bold underline">Login</a> to message posters, create a post and bookmark posts.
                </p>
            </div>
        )
    }

    if (!userIsInDiscordServer) {
        return (
            <div className="c-onboarding-info-box">
                <p className="text-black">
                    You need to be in the {discordGroupName} Discord server to contact other users -&nbsp;
                    <a href={discordGroupInviteUrl} className="font-bold underline">click here to join!</a>
                </p>
            </div>
        )
    }

    return null
}
