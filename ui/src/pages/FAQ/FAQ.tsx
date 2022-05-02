import React from "react"

const FAQHeading: React.FC<{question: string}>= ({question, children}) => {
    return (
        <div className="grid place-items-center bg-gray-900">
            <div className="py-12 w-2/6">
                <h2 className="text-white-900 font-bold text-4xl">{question}</h2>
                {children}
            </div>
        </div>
    )
};

const FAQImage: React.FC<{question: string, left?: boolean, image: string}> = ({question, left, image, children}) => {
    return (
        <div className="py-16 odd:bg-gray-900">
            <div className="container m-auto px-6 md:px-12 xl:px-6">
                <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
                        {left &&
                            <div className="md:5/12 lg:w-5/12">
                                <img src={image} alt="image" loading="lazy" width="" height="" />
                            </div>
                        }
                        <div className="md:7/12 lg:w-6/12">
                            <h2 className="text-2xl text-white-900 font-bold md:text-4xl">{question}</h2>
                            {children}
                        </div>
                        {!left &&
                            <div className="md:5/12 lg:w-5/12">
                                <img src={image} alt="image" loading="lazy" width="" height="" />
                            </div>
                        }
                </div>
            </div>
        </div>)
};

const FAQTextItem: React.FC<{question: string}> = ({question, children}) => {
    return (
        <div className="grid place-items-center">
            <div className="py-12 w-2/6">
                <h2 className="text-white-900 font-bold text-4xl">{question}</h2>
                {children}
            </div>
        </div>
    );
};

export const FAQ = () => {
    return (<>
        <main>
            <h2 className="font-medium leading-tight text-5xl p-8 text-center">Welcome to the GMTK Game Jam 2022 Team Finder!</h2>
            <div className="text-lg">
                <FAQHeading question="What is this website?">
                    <p className="pt-6">
                        This is a semi-official fan project aimed at supporting the jam in becoming more community-driven,
                        and to help you jammers make new teams and maybe even meet new friends!
                    </p>
                    <p className="pt-4">
                        <span className="italic">This is not run by Mark Brown!</span> Mark gave his blessing for us to use his shiny logos and branding,
                        but other than that Mark isn&#39;t directly involved in the development of this tool.
                        Please do not contact Mark with questions about this tool.
                    </p>
                </FAQHeading>

                <FAQImage image="/team-list.png" left={true} question="How do I find teams to join?">
                    <p>
                        If you are looking for a team to join, click on the Team Finder tab above!
                    </p>
                    <p>
                        You can scroll through the list of teams that other jammers have posted
                        and filter them according to what skills they are looking for.
                    </p>
                    <p>
                        Once you find a team that looks good, click the &quot;Message on Discord&quot; button
                        and a window will open to their Discord profile where you can contact them.
                    </p>
                </FAQImage>

                <FAQImage image="/add-team-form.png" question="How do I post my own team?">
                    <p>
                        If you want to post about your own team to find new teammates, click on the Post / Edit Your Team tab above.
                    </p>

                    <p>
                        You will be asked to authenticate your Discord account (don&#39;t worry, we only get access to your Discord username).
                    </p>

                    <p>
                        Once you&#39;re logged in, you can fill in what roles you are looking for and write a short description about your team.
                        Make sure that you allow for friend requests from &quot;Everyone&quot; in your <a href="FinderSettingsImage_2.png" className="underline">Discord settings</a>, otherwise people can&#39;t contact you!
                    </p>
                </FAQImage>

                <FAQTextItem question="I just posted/updated my post, but I can't see it in the Team Finder?">
                    <p>
                        It can take up to 5 minutes for the Team Finder to update after you make a change. If it&apos;s been more than 5 minutes, and you still can&apos;t see your team,
                        please <span className="text-accent1">@Team Finder Tech Support</span> on the GMTK Discord server.
                    </p>
                </FAQTextItem>

                <FAQTextItem question="I've found someone for my team, what do I do now?">
                    <p>
                        If you&#39;ve filled a role and are no longer looking for it, you can edit your team post in the Post / Edit Your Team tab above.<br />
                        If you&#39;re no longer looking for any more team members, make sure to delete your post in the Post / Edit Your Team tab!
                    </p>
                </FAQTextItem>
                <FAQTextItem question="Can I report team posts?">
                    <p>
                        Yes! If you have any moderation concerns, use the Report function
                        or contact the Jam Moderators on the GMTK Discord server.
                        If you are encountering technical problems, please <span className="text-accent1">@Team Finder Tech Support</span> on the GMTK Discord server.
                    </p>
                </FAQTextItem>

                <FAQTextItem question="What is the GMTK Game Jam 2021, anyway?">
                    <p>
                        Please see <a style={{ textDecorationThickness: "3px" }} className="text-accent1 underline hover:text-accent2" href="https://itch.io/jam/gmtk-2021">the official itch.io page for details</a>.
                    </p>
                </FAQTextItem>
            </div>
        </main>
    </>)
}