import React from "react";
import { ReactSVG } from "react-svg";


const FAQItem: React.FC<{heading:string}> = ({heading, children}) => {

  const id = heading.toLowerCase().replace(/ /g, "_").replace(/[^a-z0-9_]/g, "");

  const deepLinkRef = window.location.hash.replace("#", "")
  const isDirectLinkToItem = deepLinkRef === id;

  const [isCollapsed, setCollapsed] = React.useState(!isDirectLinkToItem);

  const arrowClass = "inline-block ml-2 w-4 " + (isCollapsed ? "" : "transform rotate-180");

  return (<>
    <h2
      id={id}
      className="text-3xl text-white font-light mb-4 mt-12"
      onClick={() => setCollapsed(!isCollapsed)}
    >
      <a href={"#"+id}>{heading} <img className={arrowClass} src="/chevron.svg"/> </a>
    </h2>
    {isCollapsed ? null : children}
  </>);
};

const AboutPara: React.FC = ({children}) => (<p className="mb-2">{children}</p>);

export const About: React.FC = () => {

  return (<>
    <div className="text-center text-3xl text-primary font-light my-12">
    Welcome to the GMTK Game Jam 2021 Team Finder!<br></br>
    </div>

    <FAQItem heading="What is this website?">
      <AboutPara>
        This is a semi-official fan project aimed at supporting the jam in becoming more community-driven,
        and to help you jammers make new teams and maybe even meet new friends!
      </AboutPara>

      <AboutPara>
        <span className="italic">This is not run by Mark Brown!</span> Mark gave his blessing for us to use his shiny logos and branding,
        but other than that Mark isn&#39;t directly involved in the development of this tool.
        Please do not contact Mark with questions about this tool.
      </AboutPara>
    </FAQItem>

    <FAQItem heading="How do I find teams to join?">
      <AboutPara>
      If you are looking for a team to join, click on the Team Finder tab above!
      </AboutPara>

      <AboutPara>
        You can scroll through the list of teams that other jammers have posted
        and filter them according to what skills they are looking for.
      </AboutPara>

      <AboutPara>
        Once you find a team that looks good, click the &quot;Message on Discord&quot; button
        and a window will open to their Discord profile where you can contact them.
      </AboutPara>
    </FAQItem>
    
    <FAQItem heading="How do I post my own team?">
      <AboutPara>
        If you want to post about your own team to find new teammates, click on the Post / Edit Your Team tab above.
      </AboutPara>

      <AboutPara>
        You will be asked to authenticate your Discord account (don&#39;t worry, we only get access to your Discord username).
      </AboutPara>

      <AboutPara>
        Once you&#39;re logged in, you can fill in what roles you are looking for and write a short description about your team.
        Make sure that you allow for friend requests from &quot;Everyone&quot; in your <a href="FinderSettingsImage_2.png" className="underline">Discord settings</a>, otherwise people can&#39;t contact you!
      </AboutPara>
    </FAQItem>

    <FAQItem heading="I just posted/updated my post, but I can't see it in the Team Finder?">
      <AboutPara>
        It can take up to 5 minutes for the Team Finder to update after you make a change. If it&apos;s been more than 5 minutes, and you still can&apos;t see your team,
        please <span className="text-primary">@Team Finder Tech Support</span> on the GMTK Discord server.
      </AboutPara>
    </FAQItem>
    
    <FAQItem heading="I've found someone for my team, what do I do now?">
      <AboutPara>
        If you&#39;ve filled a role and are no longer looking for it, you can edit your team post in the Post / Edit Your Team tab above.<br />
        If you&#39;re no longer looking for any more team members, make sure to delete your post in the Post / Edit Your Team tab!
      </AboutPara>
    </FAQItem>
    
    <FAQItem heading="Can I report team posts?">
      <AboutPara>
        Yes! If you have any moderation concerns, use the Report function
        <ReactSVG
          style={{width:16}}
          src="/Flag.svg"
          className="inline-block fill-gray-500 mx-1"
        />
        or contact the Jam Moderators on the GMTK Discord server.
        If you are encountering technical problems, please <span className="text-primary">@Team Finder Tech Support</span> on the GMTK Discord server.
      </AboutPara>  
    </FAQItem>
    
    <FAQItem heading="What is the GMTK Game Jam 2021, anyway?">
      <AboutPara>
        Please see <a className="text-primary underline" href="https://itch.io/jam/gmtk-2021">the official itch.io page for details</a>.
      </AboutPara>
    </FAQItem>

    <div className="mb-12"></div>
  </>);
};
