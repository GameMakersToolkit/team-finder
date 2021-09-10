import * as React from "react";
import { NavLink } from "react-router-dom";
import { UserInfo } from "../utils/UserInfo";
import { getTeam } from "../utils/TeamActions";
import { useQuery } from "react-query";
import { SkillsetSVG } from "./SkillsetSVG";
import { getSkillsets } from "../utils/Skillsets";
import { matchifFunc } from "../utils/match";


let userInfo: UserInfo = {
    id: "undefined",
    username: "undefined",
    avatar: "undefined",
    discriminator: "undefined",
    is_in_guild: false,
};

let storedUserData = null;


// TODO: Handle data not present/malformed
export function isUserLoggedIn(): boolean {
  return (localStorage.getItem("userData") != null);
}

export const PageUserInfo: React.FC = () => (
  <div className="text-center mb-14">
    { isUserLoggedIn() ? (
        storedUserData = localStorage.getItem("userData"),
        userInfo = JSON.parse(storedUserData || '{}'),
        <LoggedInUserInfoPanel
            avatar={userInfo.avatar}
            discriminator={userInfo.discriminator}
            id={userInfo.id}
            is_in_guild={userInfo.is_in_guild}
            username={userInfo.username}
        />
      ) : (
        <LoggedOutUserInfoPanel />
      )
    }
  </div>
);

const LoggedInUserInfoPanel: React.FC<UserInfo> = ({avatar, username}) => {
  const {data, isLoading, isError} = useQuery("userTeam", async () => getTeam());

  const teamSkills = matchifFunc<React.ReactNode>(
    [isLoading, ()=> "..."],
    [isError, ()=> "Error: Couldn't get team info"],
    [data, ()=> 
      getSkillsets(data!.skillsetMask).map(r =>
        <SkillsetSVG skillsetId={r.id} key={r.id} className="align-middle w-7 fill-primary inline-block m-1 align-top"/>
      )
    ]
  ) || "No team registered";

  return (
    <div className="inline-flex flex-row justify-center items-center p-6">
      <img style={{height: "90px", width: "90px"}} className="object-cover rounded-full ring-4 ring-primary" src={avatar} />
      <div className="flex flex-col justify-center">
        <div className="flex flex-row mb-2">
          <h1 className="text-white font-bold text-lg text-left mx-6">
            {username}
          </h1>
          <NavLink to="/logout" className="bg-red-500 text-trueWhite leading-none p-1.5 pb-2 rounded text-white text-right ml-6 hover:cursor-pointer">Log Out</NavLink>
        </div>
        <h1 className="text-white text-center mx-6">Team Skills Needed:</h1>
        <h1 className="text-white text-center mx-6">{teamSkills}</h1>
      </div>
    </div>
  )
}

const LoggedOutUserInfoPanel: React.FC = () => (
  <>
    <a href={`${import.meta.env.VITE_API_URL}/oauth2/authorization/discord`} className="inline-block text-white text-3xl mt-8 mb-2 w-auto hover:underline">Log In{"\n"}With Discord</a>
    <div className="text-white">if you want to register a Team</div>
  </>
)
