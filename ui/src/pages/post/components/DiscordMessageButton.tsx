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
        <span className="post__footer--contact-button">
            <a
                target="_blank"
                rel="noreferrer"
                href={isLoggedIn ? `https://discord.com/users/${authorId}` : undefined}
                onClick={!isLoggedIn ? login : undefined}
            >
                Message {author} on Discord{' '} {!isLoggedIn && <>(Log in to continue)</>}
            </a>
        </span >
    );
};
