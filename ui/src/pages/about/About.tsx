import React from "react";
import {Link} from "react-router-dom";
import { JamSpecificStyling } from "../../common/components/JamSpecificStyling";

const discordGroupName = import.meta.env.VITE_DISCORD_NAME;
const discordGroupInviteUrl = import.meta.env.VITE_DISCORD_INVITE_URL;
const jamName = import.meta.env.VITE_JAM_NAME;
const jamUrl = import.meta.env.VITE_JAM_URL;

export const About: React.FC = () => {
    return (
        <JamSpecificStyling>
        <main>
            <div className=" border-white border-b-2 mb-6">
                <h1>About the Team Finder</h1>
                <h2>What is the Team Finder?</h2>
                <p className="mb-6">
                    Welcome to the Team Finder!
                    You can use this website to find other game jam participants to team up with
                    for the game jam. Browse the post list or make a post of your own!
                </p>
            </div>

            <div className="flex flex-wrap gap-4">
                <div className="c-question">
                    <h2>How do I find jammers to join?</h2>
                    <p>
                        If you are looking for a team to join or for someone to join your team, use the search tools
                        on&nbsp;
                        <Link className="hover:underline cursor-pointer" to="/gmtk/my-post">the homepage</Link> to find
                        other
                        jammers!
                    </p>

                    <p>You can scroll through the list of posts that other jammers have made and filter
                        them according to what skills they/you are looking for.
                    </p>

                    <p>
                        Once you find a person or team that looks good, click the &quot;Message on Discord&quot; button
                        and
                        a window
                        will open to their Discord profile where you can contact them! Keep in mind that you need to be
                        logged in
                        via your Discord on the Team Finder, otherwise the site won&apos;t know how to pair you up!
                    </p>

                    <p className="font-bold">
                        Keep in mind that you need to be a member of the jam's Discord server to be able to contact them!
                    </p>
                </div>

                <div className="c-question">
                    <h2>How do I post my own team?</h2>
                    <p>
                        If you want to post about your own team to find new teammates,
                        click on the Post / Edit Your Team tab above.
                    </p>

                    <p>
                        You will be asked to authenticate your Discord account (don&#39;t
                        worry, we only get access to your Discord username).
                    </p>

                    <p>
                        Once you&#39;re logged in, you can fill in what roles you are
                        looking for and write a short description about your team. Make
                        sure that you allow for friend requests from &quot;Everyone&quot;
                        in your <a href="FinderSettingsImage_2.png" className="underline">Discord settings</a>,
                        otherwise people can&#39;t contact you!
                    </p>
                </div>

                <div className="c-question">
                    <h2>I've found someone for my team, what now?</h2>
                    <p>
                        If you&#39;ve filled a role and are no longer looking for it, you
                        can edit your team post in the <Link className="hover:underline cursor-pointer"
                                                             to="/gmtk/my-post">Post
                        /
                        Edit Your Team tab above!</Link>
                    </p>
                    <p>
                        If you&#39;re no longer looking for any more team members, make
                        sure to delete your post once you&#39;re finished!
                    </p>
                    <p>
                        The option to delete your post is in the bottom-left of the <Link
                        className="hover:underline cursor-pointer" to="/gmtk/my-post">Post / Edit Your Team page</Link>.
                    </p>
                </div>

                <div className="c-question">
                    <h2>Can I report team posts?</h2>
                    <p>
                        Yes! If you have any moderation concerns, use the Report function
                        or contact the Jam Moderators on the {discordGroupName} Discord server.
                    </p>
                    <p>
                        If you are encountering technical problems, press 'Contact Support' in the header bar or message 
                        <span className="text-accent1">@dotwo</span> on
                        the {discordGroupName} Discord server.
                    </p>
                </div>
            </div>
        </main>
        </JamSpecificStyling>
    )
}
