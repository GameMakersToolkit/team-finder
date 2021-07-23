import React from "react";
import {tryPerformAction} from "./AdminActions";
import {adminRedeemUser} from "../../utils/TeamActions";

const tryRedeemUser = (discordId: string) => tryPerformAction(() => adminRedeemUser(discordId))

export interface User {
  name: string;
  discordId: string;
}

export const UserView: React.FC<{user:User}> = ({user}) => {
  const buttonStyling = "bg-blue-500 w-full py-2 mb-3 rounded color-red"

  console.log(user)
  return (
    <>
      <div className="inline-block" style={{width: "75%", verticalAlign: "top"}}>
        <ul>
          <li>Name: {user.name}</li>
          <li>Discord ID {user.discordId}</li>
        </ul>
      </div>
      <div className="inline-block pl-3" style={{width: "25%", verticalAlign: "top"}}>
        <button onClick={() => tryRedeemUser(user.discordId)} className={buttonStyling}>Redeem User</button>
      </div>
    </>
  )
}
