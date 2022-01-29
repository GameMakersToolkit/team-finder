import React from "react";
import {Team, TeamData} from "../../../oldsrc/components/Team";
import {adminBanUser, adminClearReports, adminDeleteTeam} from "../../utils/TeamActions";
import {tryPerformAction} from "./AdminActions";

const tryDeleteTeam = (teamId: string) => tryPerformAction(() => adminDeleteTeam(teamId))

const tryBanUser = (userId: string) => tryPerformAction(() => adminBanUser(userId))

const tryClearReports = (teamId: string) => tryPerformAction(() => adminClearReports(teamId))

export const TeamView: React.FC<{team:TeamData}> = ({team}) => {
  const buttonStyling = "w-full py-2 mb-3 rounded"

  return (
    <div>
      <div className="inline-block" style={{width: "75%", verticalAlign: "top"}}>
        <Team key={team.id} team={team} />
      </div>
      <div className="inline-block pl-3" style={{width: "25%", verticalAlign: "top"}}>
        <p className="mb-2">Report count: {team.reportCount}</p>
        <button onClick={() => tryDeleteTeam(team.id.toString())} className={buttonStyling + " bg-red-500"}>Delete Team</button> <br />
        <button onClick={() => tryBanUser(team.authorId)} className={buttonStyling + " bg-red-500"}>Ban User</button>
        <button onClick={() => tryClearReports(team.id.toString())} className={buttonStyling + " bg-green-500"}>Clear Reports</button>
      </div>
    </div>
  )
}
