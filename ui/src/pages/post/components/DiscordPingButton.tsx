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
            <span className="mb-6 p-2 rounded inline-flex cursor-pointer rounded-xl border border-blue-200 text-blue-200">
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
