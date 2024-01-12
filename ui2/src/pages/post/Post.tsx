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

export const Post: React.FC<{}> = () => {

    const { postId } = useParams()
    const navigate = useNavigate();
    const [post, setPost] = useState<PostModel>()

    useEffect(() => {
        console.log(`http://localhost:8080/posts/${postId}`)
        fetch(`http://localhost:8080/posts/${postId}`)
            .then(res => res.json())
            .then(setPost)
    }, [])

    if (!post) {
        return (<></>)
    }

    return (
        <>
            <header className="container mx-auto px-4 pb-6 pt-4 text-xl">
                <a className="text-grey-200 mr-2 cursor-pointer hover:underline" onClick={() => navigate(-1)}>Search results</a>
                <span className="mr-2">&gt;</span>
                {/*<span className="mr-2">{iiicon('right-arrow', "#FFFFFF", 16, 16)}</span>*/}
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
                                <OptionsListDisplay optionsToDisplay={post.skillsSought} totalOptions={skills} label={"Looking for:"} className={"[--skill-color:theme(colors.blue-700)]"}/>
                                <OptionsListDisplay optionsToDisplay={post.skillsPossessed} totalOptions={skills} label={"Can do:"} className={"[--skill-color:theme(colors.indigo)]"}/>
                            </div>
                            <div className="sm:inline-block sm:w-[50%] lg:w-[33%]">
                                <OptionsListDisplay optionsToDisplay={post.preferredTools} totalOptions={tools} label={"Preferred Engine(s):"} className={"[--skill-color:theme(colors.green-300)]"}/>
                                <OptionsListDisplay optionsToDisplay={post.languages} totalOptions={languages} label={"Language(s):"} className={"[--skill-color:theme(colors.grey-800)]"}/>
                            </div>

                            <div className="hidden lg:inline-block lg:w-[33%]">
                                <OptionsListDisplay optionsToDisplay={post.timezoneOffsets} totalOptions={timezones} label={"Timezone(s):"} className={"[--skill-color:theme(colors.grey-300)]"}/>
                            </div>
                        </div>
                        {/* Full width on larger devices */}
                        <div className="inline-block w-full lg:hidden">
                            <OptionsListDisplay optionsToDisplay={post.timezoneOffsets} totalOptions={timezones} label={"Timezone(s):"} className={"[--skill-color:theme(colors.grey-300)]"}/>
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
                                    &lt; Back to search results
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
        </>
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

    const userShouldSeePingButton = isLoggedIn && !userInfo.isLoading;
    const userCanPingAuthor = userInfo.data?.isInDiscordServer;

    const createBotDmMutation = useCreateBotDmMutation();

    const fallbackPingMessage = canPostAuthorBeDMd ? "Message button not working?" : "This post's author cannot receive direct messages"

    {/* If the user isn't logged in, don't display any ping message; it just looks kinda bad */}
    if (!userShouldSeePingButton) {
        return (
            <div className="text-center">
                {canPostAuthorBeDMd && <DiscordMessageButton authorId={authorId} author={author} isLoggedIn={isLoggedIn} />}
            </div>
        )
    }

    return (
        <div className="text-center">
            {canPostAuthorBeDMd && <DiscordMessageButton authorId={authorId} author={author} isLoggedIn={isLoggedIn} />}

            {userCanPingAuthor
                ? <DiscordPingButton authorId={authorId} createBotDmMutation={createBotDmMutation} message={fallbackPingMessage} />
                : <p>Sorry, you can&apos;t contact this user right now.<br />Please make sure you&apos;ve joined the discord server!</p>
            }
        </div>
    );
};
