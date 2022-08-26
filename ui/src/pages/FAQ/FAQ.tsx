import React from "react";
import teamListImg from "./team-list.png";
import addTeamFormImg from "./add-team-form.png";
import { Link } from "react-router-dom";
import { importMetaEnv } from "../../utils/importMeta";

const discordGroupName = importMetaEnv().VITE_DISCORD_NAME;
const discordGroupInviteUrl = importMetaEnv().VITE_DISCORD_INVITE_URL;
const jamName = importMetaEnv().VITE_JAM_NAME;
const jamUrl = importMetaEnv().VITE_JAM_URL;

const FAQHeading: React.FC<{ question: string }> = ({ question, children }) => {
  return (
    <div className="grid place-items-center bg-gray-900">
      <div className="py-12 w-5/6">
        <h2 className="text-white-900 font-bold text-4xl">{question}</h2>
        {children}
      </div>
    </div>
  );
};

const FAQImage: React.FC<{
  question: string;
  left?: boolean;
  image: string;
}> = ({ question, left, image, children }) => {
  return (
    <div className="py-16 odd:bg-gray-900">
      <div className="container m-auto px-6 md:px-12 xl:px-6">
        <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
          {left && (
            <div className="md:5/12 lg:w-5/12">
              <img src={image} alt="image" loading="lazy" width="" height="" />
            </div>
          )}
          <div className="md:7/12 lg:w-6/12">
            <h2 className="text-2xl text-white-900 font-bold md:text-4xl mb-4">
              {question}
            </h2>
            {children}
          </div>
          {!left && (
            <div className="md:5/12 lg:w-5/12">
              <img src={image} alt="image" loading="lazy" width="" height="" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FAQTextItem: React.FC<{ question: string }> = ({
  question,
  children,
}) => {
  return (
    <div className="pb-12">
      <h2 className="text-white-900 font-bold text-2xl sm:text-3xl mb-4">{question}</h2>
      {children}
    </div>
  );
};

export const FAQ = () => {
  return (
    <>
      <main>
        <h2 className="font-medium leading-tight text-5xl p-8 text-center">
          {`Welcome to the ${jamName} Team Finder!`}
        </h2>
        <div className="text-lg">
          <FAQHeading question="What is this website?">
            <p className="pt-6">
              {`Welcome to the Team Finder! You can use this website to find other game jam participants to team up with
              for the ${jamName}! Browse the post list or make a post of your own!`}
            </p>

            {discordGroupName === "GMTK" && (<>
            <p className="pt-4">
              <span className="italic">This is not run by Mark Brown!</span>{" "}
              Mark gave his blessing for us to use his shiny logos and branding,
              but other than that Mark isn&#39;t directly involved in the
              development of this website.
            </p>
            <p className="pt-4">
              This is a semi-official fan project aimed at supporting the jam in
              becoming more community-driven - please do not contact Mark with
              questions about the Team Finder!
            </p>
            </>)}

          </FAQHeading>

          <FAQImage
            image={teamListImg}
            left={true}
            question="How do I find jammers to join?"
          >

            <p>If you are looking for a team to join or for someone to join your team, use the search tools on
              <Link className="hover:underline cursor-pointer" to="/my-post">the homepage</Link> to find other jammers!
            </p>

            <p>You can scroll through the list of posts that other jammers have made and filter
              them according to what skills they/you are looking for.</p>

            <p>Once you find a person or team that looks good, click the &quot;Message on Discord&quot; button and a window
              will open to their Discord profile where you can contact them! Keep in mind that you need to be logged in
              via your Discord on the Team Finder, otherwise the site won&apos;t know how to pair you up!</p>

            <p className="font-bold">
              Keep in mind that you need to be a member of the{" "}
              <Link className="hover:underline cursor-pointer" to={`/${discordGroupInviteUrl}`}>{discordGroupName} Discord server</Link>{" "}
              to be able to contact them!
            </p>
          </FAQImage>

          <FAQImage
            image={addTeamFormImg}
            question="How do I post my own team?"
          >
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
              in your{" "}
              <a href="FinderSettingsImage_2.png" className="underline">
                Discord settings
              </a>
              , otherwise people can&#39;t contact you!
            </p>
          </FAQImage>

          <div className="container m-auto px-6 md:px-12 xl:px-6">
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 pt-16 sm:pt-12">
              <FAQTextItem question="I've found someone for my team, what do I do now?">
                <p>
                  If you&#39;ve filled a role and are no longer looking for it, you
                  can edit your team post in the <Link className="hover:underline cursor-pointer" to="/my-post">Post / Edit Your Team tab above!</Link>
                </p>
                <p>
                  If you&#39;re no longer looking for any more team members, make
                  sure to delete your post once you&#39;re finished!
                  <br />
                  The option to delete your post is in the bottom-left of the <Link className="hover:underline cursor-pointer" to="/my-post">Post / Edit Your Team page</Link>.
                </p>
              </FAQTextItem>
              <FAQTextItem question="Can I report team posts?">
                <p>
                  Yes! If you have any moderation concerns, use the Report function
                  or contact the Jam Moderators on the {discordGroupName} Discord server. If you
                  are encountering technical problems, please tag{" "}
                  <span className="text-accent1">@Team Finder Tech Support</span> on
                  the {discordGroupName} Discord server.
                </p>
              </FAQTextItem>

              <FAQTextItem question={`What is the ${jamName}, anyway?`}>
                <p>
                  Please see{" "}
                  <a
                    style={{ textDecorationThickness: "3px" }}
                    className="text-accent1 underline hover:text-accent2"
                    href={jamUrl}
                  >
                    the official itch.io page for details
                  </a>
                  .
                </p>
              </FAQTextItem>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
