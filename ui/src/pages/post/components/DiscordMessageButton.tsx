import React from "react";
import {login} from "../../../api/login.ts";

export const DiscordMessageButton: React.FC<{
    authorId: string,
    author: string,
    isLoggedIn: boolean
}> = ({
    authorId,
    author,
    isLoggedIn,
}) => {
    return (
        <span className="mb-6 px-6 py-2 border-[var(--theme-accent-light)] bg-[var(--theme-accent-light)] rounded-xl text-grey-900 font-bold inline-flex cursor-pointer">
            <a
                target="_blank"
                rel="noreferrer"
                href={isLoggedIn ? `https://discord.com/users/${authorId}` : undefined}
                onClick={!isLoggedIn ? login : undefined}
                className="text-sm"
            >
                Message {author} on Discord{' '} {!isLoggedIn && <>(Log in to continue)</>}
            </a>
        </span >
    );
};
