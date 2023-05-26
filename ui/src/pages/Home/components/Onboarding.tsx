import React from "react";
import { useUserInfo } from "../../../queries/userInfo";
import { useAuth } from "../../../utils/AuthContext";
import { login } from "../../../utils/login";
import {importMetaEnv} from "../../../utils/importMeta";

const discordGroupName = importMetaEnv().VITE_DISCORD_NAME;
const discordGroupInviteUrl = importMetaEnv().VITE_DISCORD_INVITE_URL;

const onboardingMessageBoxStyle = "bg-blue-100 rounded-xl text-black mt-6 px-4 py-2 mb-4"

export const Onboarding: React.FC = () => {
  const isLoggedIn = Boolean(useAuth());
  const userInfo = useUserInfo();
  if (userInfo.isLoading) return null

  if (!isLoggedIn) return (
    <div className={onboardingMessageBoxStyle}>
      <p className=""><a onClick={login} className="font-bold underline">Login</a> to message posters, create a post and bookmark posts.</p>
    </div>
  )

  const userIsInDiscordServer = userInfo.data?.isInDiscordServer;
  if (!userIsInDiscordServer) return (
    <div className={onboardingMessageBoxStyle}>
      <p className="">You need to be in the {discordGroupName} Discord server to contact other users -&nbsp;
        <a href={discordGroupInviteUrl} className="font-bold underline">click here to join!</a>
      </p>
    </div>
  )

  return null
}
