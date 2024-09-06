import React, {useEffect, useState} from "react";
import { Post as PostModel } from "../../common/models/post.ts"
import {useNavigate, useParams} from "react-router-dom";
import {TeamSizeIcon} from "../../common/components/TeamSizeIcon.tsx";
import {OptionsListDisplay} from "../../common/components/OptionsListDisplay.tsx";
import {skills} from "../../common/models/skills.tsx";
import {tools} from "../../common/models/engines.tsx";
import {languages} from "../../common/models/languages.ts";
import {timezones} from "../../common/models/timezones.ts";
import {useAuth} from "../../api/AuthContext.tsx";
import {useUserInfo} from "../../api/userInfo.ts";
import {useCreateBotDmMutation} from "../../api/bot.ts";
import {DiscordMessageButton} from "./components/DiscordMessageButton.tsx";
import {DiscordPingButton} from "./components/DiscordPingButton.tsx";
import {ReportButton} from "./components/ReportButton.tsx";
import {ReportBrokenDMsButton} from "./components/ReportBrokenDMsButton.tsx";
import {FavouritePostIndicator} from "../../common/components/FavouritePostIndicator.tsx";
import {iiicon} from "../../common/utils/iiicon.tsx";
import {JoinDiscordButton} from "./components/JoinDiscordButton.tsx";
import {JamSpecificStyling} from "../../common/components/JamSpecificStyling.tsx";

export const Post: React.FC<{}> = () => {

    const { jamId, postId } = useParams()
    const navigate = useNavigate();
    const [post, setPost] = useState<PostModel>()

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}?jamId=${jamId}`)
            .then(res => res.json())
            .then(setPost)
    }, [])

    if (!post) {
        return (<></>)
    }

    return (
        <JamSpecificStyling>
            <header className="container mx-auto px-4 pb-6 pt-4 text-xl">
                <a className="text-grey-200 mr-2 cursor-pointer hover:underline" onClick={() => navigate(-1)}>Search results</a>
                <span className="mr-2">{iiicon('right-arrow', "#FFFFFF", 16, 16)}</span>
                <span>{post.author}</span>
            </header>

            <main>
                <section className="c-post">
                    <header className="post__header">
                        <TeamSizeIcon size={post.size} />

                        <span className="grow" style={{width: "calc(100% - 100px)"}}>
                            <h3 className="post__header--title">
                                {post.author}
                            </h3>
                            <p className="post__header--subtitle">
                                {post.size > 1 ? ` and ${post.size - 1} others are` : `is`} looking for members
                            </p>
                        </span>

                        <FavouritePostIndicator post={post} className={""} />
                    </header>

                    <div className="post__body">
                        <div className="flex flex-col sm:flex-row">
                            <div className="sm:inline-block sm:w-[50%] lg:w-[33%]">
                                <OptionsListDisplay optionsToDisplay={post.skillsSought} totalOptions={skills} label={"Looking for:"} className={"[--skill-color:var(--skill-color-looking-for)] [--skill-text-color:var(--skill-color-looking-for-text)]"} />
                                <OptionsListDisplay optionsToDisplay={post.skillsPossessed} totalOptions={skills} label={"Can do:"} className={"[--skill-color:var(--skill-color-possessed)] [--skill-text-color:var(--skill-color-possessed-text)]"} />
                            </div>
                            <div className="sm:inline-block sm:w-[50%] lg:w-[33%]">
                                <OptionsListDisplay optionsToDisplay={post.preferredTools} totalOptions={tools} label={"Preferred Engine(s):"} className={"[--skill-color:var(--skill-color-engines)] [--skill-text-color:var(--skill-color-engines-text)]"} />
                                <OptionsListDisplay optionsToDisplay={post.languages} totalOptions={languages} label={"Language(s):"} className={"[--skill-color:var(--skill-color-languages)] [--skill-text-color:var(--skill-color-languages-text)]"} />
                            </div>

                            <div className="hidden lg:inline-block lg:w-[33%]">
                                <OptionsListDisplay optionsToDisplay={post.timezoneOffsets} totalOptions={timezones} label={"Timezone(s):"} className={"[--skill-color:var(--skill-color-timezones)] [--skill-text-color:var(--skill-color-timezones-text)]"} />
                            </div>
                        </div>
                        {/* Full width on larger devices */}
                        <div className="inline-block w-full lg:hidden">
                            <OptionsListDisplay optionsToDisplay={post.timezoneOffsets} totalOptions={timezones} label={"Timezone(s):"} className={"[--skill-color:var(--skill-color-timezones)] [--skill-text-color:var(--skill-color-timezones-text)]"} />
                        </div>
                        <div className="post__body--description mt-6">
                            {post.description.split("\n").map((line, idx) => <p dir="auto" key={idx} className="mb-1">{line}</p>)}
                        </div>
                    </div>

                    <div className="post__footer">
                        <MessageOnDiscordButton author={post.author} authorId={post.authorId} unableToContactCount={post.unableToContactCount} />

                        <div>
                            <div className="inline-block w-[50%]">
                                <a className="font-bold underline cursor-pointer" onClick={() => history.back()}>
                                    {iiicon('left-arrow', "#FFFFFF", 16, 16)} Back to search results
                                </a>
                            </div>
                            <div className="inline-block w-[50%] text-right">
                                <ReportButton post={post} />
                                <ReportBrokenDMsButton post={post} />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </JamSpecificStyling>
    )
}


/**
 * Present Discord CTA to user
 *
 * The direct link has been a bit finicky in the past - we should make this more robust where possible
 * TODO: Investigate if app links are feasible
 * TODO: Don't display if user fails Guild Permissions check
 */
const MessageOnDiscordButton: React.FC<{
    author: string;
    authorId: string;
    unableToContactCount: number
}> = ({
    author,
    authorId,
    unableToContactCount,
}) => {
    const isLoggedIn = Boolean(useAuth());
    const userInfo = useUserInfo();
    const canPostAuthorBeDMd = unableToContactCount < 5; // Arbitrary number

    const userIsLoggedIn = isLoggedIn && !userInfo.isLoading;
    const inDiscordServer = userInfo.data?.isInDiscordServer;

    const createBotDmMutation = useCreateBotDmMutation();

    const fallbackPingMessage = canPostAuthorBeDMd ? "Message button not working?" : "This post's author cannot receive direct messages"

    if (userIsLoggedIn && !inDiscordServer) {
        return (
            <div className="text-center">
                <JoinDiscordButton />
            </div>
        )
    }

    {/* If the user isn't logged in, don't display any ping message; it just looks kinda bad */}
    if (!userIsLoggedIn) {
        return (
            <div className="text-center">
                {canPostAuthorBeDMd && <DiscordMessageButton authorId={authorId} author={author} isLoggedIn={isLoggedIn} />}
            </div>
        )
    }

    return (
        <div className="text-center">
            {canPostAuthorBeDMd && <DiscordMessageButton authorId={authorId} author={author} isLoggedIn={isLoggedIn} />}

            {inDiscordServer
                ? <DiscordPingButton authorId={authorId} authorName={author} createBotDmMutation={createBotDmMutation} message={fallbackPingMessage} />
                : <>
                    <p>Sorry, you can&apos;t contact this user right now.</p>
                    <p>
                        <a target="_blank" rel="noreferrer" href={import.meta.env.VITE_DISCORD_INVITE_URL} className="underline text-sm">
                            {`Please make sure you've joined the discord server!`}
                        </a>
                    </p>
                </>
            }
        </div>
    );
};
