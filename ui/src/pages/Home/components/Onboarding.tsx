import React from "react";
import { useUserInfo } from "../../../queries/userInfo";
import { useAuth } from "../../../utils/AuthContext";
import { login } from "../../../utils/login";
import {importMetaEnv} from "../../../utils/importMeta";

const discordGroupName = importMetaEnv().VITE_DISCORD_NAME;
const discordGroupInviteUrl = importMetaEnv().VITE_DISCORD_INVITE_URL;

const onboardingMessageBoxStyle = "bg-lightbg my-4 px-2 py-6"

export const Onboarding: React.FC = () => {
  const isLoggedIn = Boolean(useAuth());
  const userInfo = useUserInfo();
  if (userInfo.isLoading) return null

  if (!isLoggedIn) return (
    <div className={onboardingMessageBoxStyle}>
      <p className="text-center">Welcome to the Team Finder! <a onClick={login} className="font-bold underline">Log in with Discord to get started!</a>
      </p>
    </div>
  )

  const userIsInDiscordServer = userInfo.data?.isInDiscordServer;
  if (!userIsInDiscordServer) return (
    <div className={onboardingMessageBoxStyle}>
      <p className="text-center">You need to be in the {discordGroupName} Discord server to contact other users -&nbsp;
        <a href={discordGroupInviteUrl} className="font-bold underline">click here to join!</a>
      </p>
    </div>
  )

  return null
}
