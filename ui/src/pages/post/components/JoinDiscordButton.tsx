import { useContext } from "react";
import { JamSpecificContext } from "../../../common/components/JamSpecificStyling.tsx";
import { DiscordActionPill } from "./DiscordActionPill.tsx";

export const JoinDiscordButton = () => {
    const jam = useContext(JamSpecificContext);

    if (!jam.guildInviteLink) {
        return null;
    }

    return (
        <DiscordActionPill>
            <a
                target="_blank"
                rel="noreferrer"
                href={jam.guildInviteLink}
                className="text-sm"
            >
                {`Join the ${jam.name} community Discord server to send messages to other jammers!`}
            </a>
        </DiscordActionPill>
    )
}
