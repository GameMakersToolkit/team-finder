import React, {useEffect, useState} from "react";
import {useAuth} from "../../../api/AuthContext.tsx";
import {useUserInfo} from "../../../api/userInfo.ts";
import {login} from "../../../api/login.ts";
import {iiicon} from "../../../common/utils/iiicon.tsx";

const discordGroupName = import.meta.env.VITE_DISCORD_NAME;
const discordGroupInviteUrl = import.meta.env.VITE_DISCORD_INVITE_URL;

const LOGIN_POPUP_KEY = "login_popup_dismissed"

export const Onboarding: React.FC = () => {
    const isLoggedIn = Boolean(useAuth());
    const userInfo = useUserInfo();
    const userIsInDiscordServer = userInfo.data?.isInDiscordServer;

    const [showPopup, setShowPopup] = useState<boolean>(localStorage.getItem(LOGIN_POPUP_KEY) !== "true")

    // Hide the popup as soon as the button is clicked; using state+effect triggers the hide immediately
    useEffect(() => {
        if (!showPopup) {
            localStorage.setItem(LOGIN_POPUP_KEY, "true")
        }
    }, [showPopup]);

    if (userInfo.isLoading || !showPopup) {
        return null
    }

    if (!isLoggedIn) {
        return (
            <div className="c-onboarding-info-box">
                <p className="flex justify-between text-white">
                    <span>
                        <a onClick={login} className="font-bold underline">Login</a> to message posters, create a post and bookmark posts.
                    </span>
                    <button className="flex self-center" onClick={() => {setShowPopup(false)}}>
                        {iiicon("cross", '#FFFFFF', 20, 20)}
                    </button>
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
