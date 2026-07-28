import React from "react";
import {toast} from "react-hot-toast";
import { DiscordActionPill } from "./DiscordActionPill.tsx";

export const DiscordPingButton: React.FC<{
    authorId: string,
    authorName: string,
    createBotDmMutation: any,
    message: string
}> = ({
    authorId,
    authorName,
    createBotDmMutation,
    message,
}) => {

    const onClick = () => {
        createBotDmMutation.mutate({
            recipientId: authorId,
        }, {
            onSuccess: () => {
                toast(
                    `${authorName} has just been notified that you want to get in touch!\n\nThey will receive a DM from the Team Finder bot, or a ping in #team-finder-bot if they can't receive DMs.`,
                    {
                        style: {textAlign: "center"}
                    }
                );
            },
        });
    };

    return (
        <>
            <p className="mb-2">{message}</p>
            <DiscordActionPill variant="outline">
                <a
                    target="_blank"
                    rel="noreferrer"
                    onClick={onClick}
                    className="text-sm"
                >
                    Ping them on Discord
                </a>
            </DiscordActionPill>
        </>
    );
};
