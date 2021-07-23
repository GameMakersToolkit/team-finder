import * as React from "react";
import { reportTeam } from "../utils/TeamActions";
import { isUserLoggedIn } from "./PageUserInfo";
import { AddMessage } from "./StatusMessenger";
import { ReactSVG } from "react-svg";
import { useForceUpdate } from "../utils/useForceUpdate";

const getReports = () => JSON.parse(localStorage.getItem("reports") || '{}');
const userReportedTeam = (teamId: string) => getReports()[teamId] === true;

const successfulSubmitText = "Your report has been received, a moderator will investigate";

const trySubmitReport = async (teamId: string) => {
  if (!isUserLoggedIn()) return AddMessage("bg-red-500", "Please login (on the Register page) to report a team");
  if (userReportedTeam(teamId)) return AddMessage("bg-primary-dark", successfulSubmitText);
  

  const res = await reportTeam(teamId);

  if(res.status != 200){
    AddMessage("bg-red-500", "There was an error trying to report this team. Please try again.");
    return;
  }

  const reports = getReports();
  reports[teamId] = true;
  localStorage.setItem("reports", JSON.stringify(reports));

  AddMessage("bg-primary-dark", successfulSubmitText);
}


export const ReportButton: React.FC<{teamId:string, className?:string}> = ({teamId, className: baseClass = ""}) => {
  const forceUpdate = useForceUpdate();

  const handleClick = async () => {
    await trySubmitReport(teamId);
    forceUpdate();
  };

  return (<div onClick={handleClick} className={baseClass+" inline-block cursor-pointer text-black hover:text-red-500 transition-colors"}>
    <ReactSVG
      src="/Flag.svg"
      className={
        "inline-block relative -bottom-1.5  mr-1 w-6 pl-1 " +
        (userReportedTeam(teamId) ? "fill-red-500" : "fill-gray-500")
      }
    />
    Report?
  </div>);
}
