import React from "react";
import { useUserInfo } from "../../../queries/userInfo";
import { useAuth } from "../../../utils/AuthContext";
import { login } from "../../../utils/login";

const discordInviteUrl = "https://discord.gg/TGHj6FCJVy"

const onboardingMessageBoxStyle = "bg-lightbg my-4 px-2 py-6"

export const Onboarding: React.FC = () => {
  const isLoggedIn = Boolean(useAuth());
  const userInfo = useUserInfo();
  if (userInfo.isLoading) return null

  if (!isLoggedIn) return (
    <div className={onboardingMessageBoxStyle}>
      <p className="text-center">Want to contact other users or make your own post? <a onClick={login} className="font-bold underline">Log in with Discord!</a>
      </p>
    </div>
  )

  const userIsInDiscordServer = userInfo.data?.isInDiscordServer;
  if (!userIsInDiscordServer) return (
    <div className={onboardingMessageBoxStyle}>
      <p className="text-center">You need to be in the GMTK Discord server to contact other users -
        <a href={discordInviteUrl} className="font-bold underline">click here to join!</a>
      </p>
    </div>
  )

  return null
}