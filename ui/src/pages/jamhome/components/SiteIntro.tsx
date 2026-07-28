import {useContext} from "react";
import {JamSpecificContext} from "../../../common/components/JamSpecificStyling.tsx";
import { Countdown } from "./Countdown.tsx";

export const SiteIntro = () => {
    const theme = useContext(JamSpecificContext)
    const now = new Date();

    const jamStartMs = parseInt(theme.styles["jam-start-timestamp"] || "0");
    const submissionsCloseMs = parseInt(theme.styles["submissions-close-timestamp"] || "0");
    const jamStart = jamStartMs > 0 ? new Date(jamStartMs) : null;
    const submissionsClose = submissionsCloseMs > 0 ? new Date(submissionsCloseMs) : null;

    const countdown = jamStart && now < jamStart
        ? {target: jamStart, label: "The jam starts in", visible: true}
        : submissionsClose ? {target: submissionsClose, label: "Submissions close in", visible: now < submissionsClose} : null;

    console.log(countdown)

    return (<div className="mb-8 sm:mb-8">
            <img
                className="m-auto mb-2"
                src={theme.logoLargeUrl}
                width={"50%"}
                style={{maxWidth: "480px"}}
                alt={theme.name + " Team Finder logo"}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col justify-center mb-4 sm:m-0">
                    <p className="text-center">{`Welcome to the ${theme.name} Team Finder!`}</p>
                    {countdown?.visible && <p className="text-center">Create a post or search below to find a team.</p>}
                </div>

                <div className="text-center">
                    {countdown?.visible && <Countdown countdownTarget={countdown.target} label={countdown.label}/>}
                    {!countdown?.visible && <p className="text-center">Create a post or search below to find a team.</p>}
                </div>
            </div>
    </div>);
}
