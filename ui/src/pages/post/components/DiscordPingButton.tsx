import React from "react";

export const DiscordPingButton: React.FC<{
    authorId: string,
    createBotDmMutation: any,
    message: string
}> = ({
    authorId,
    createBotDmMutation,
    message,
}) => {
    return (
        <>
            <p className="mb-2">{message}</p>
            <span className="mb-6 p-2 rounded inline-flex cursor-pointer rounded-xl border border-theme-l-7 text-theme-l-7">
                <a
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => createBotDmMutation.mutate({ recipientId: authorId })}
                    className="text-sm"
                >
                    Ping them on Discord
                </a>
            </span>
        </>
    );
};
