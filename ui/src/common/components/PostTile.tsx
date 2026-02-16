import React, { useContext } from "react";
import {Post} from "../models/post.ts";
import {TeamSizeIcon} from "./TeamSizeIcon.tsx";
import {Link} from "react-router-dom";
import {OptionsListDisplay} from "./OptionsListDisplay.tsx";
import {skills} from "../models/skills.tsx";
import {FavouritePostIndicator} from "./FavouritePostIndicator.tsx";
import {iiicon} from "../utils/iiicon.tsx";
import { JamSpecificContext } from "./JamSpecificStyling.tsx";
import favouriteSelectedIcon from "../../assets/icons/bookmark/selected.svg";
import favouriteNotSelectedIcon from "../../assets/icons/bookmark/unselected.svg";
import { ReactSVG } from "react-svg";
import { PortfolioIcon } from "./PortfolioIcon.tsx";

export const PostTile: React.FC<{post: Post}> = ({post}) => {
    return (
        <>
            <section className="c-post-tile">
                <header className="post-tile__header">
                    <div className="flex justify-between min-w-0">
                        <TeamSizeIcon size={post.size} />

                        <span className="grow" style={{width: "calc(100% - 100px)"}}>
                            <h3 className="post-tile__header--title">
                                {post.author}
                            </h3>
                            <p className="post-tile__header--subtitle">
                                {post.size > 1 ? ` and ${post.size - 1} others are` : `is`} looking for members
                            </p>
                        </span>

                        <FavouritePostIndicator post={post} className={""} />
                    </div>
                    {/*TODO*/}
                    {post.portfolioLinks && <OptionalPortfolioLinks portfolioLinks={post.portfolioLinks} />}
                </header>

                <div className="post-tile__body">
                    <div className="fill-[var(--skill-color-looking-for-text)]">
                        <OptionsListDisplay optionsToDisplay={post.skillsSought} totalOptions={skills} label={"Looking for:"} className={"[--skill-color:var(--skill-color-looking-for)] [--skill-text-color:var(--skill-color-looking-for-text)]"}/>
                    </div>
                    <div className="fill-[var(--skill-color-possessed-text)]">
                        <OptionsListDisplay optionsToDisplay={post.skillsPossessed} totalOptions={skills} label={"Can do:"} className={"[--skill-color:var(--skill-color-possessed)] [--skill-text-color:var(--skill-color-possessed-text)]"}/>
                    </div>
                    {getDescriptionParagraphs(post).map((line, idx) => <p dir="auto" key={idx} className="mb-2">{line}</p>)}
                </div>

                <div className="post-tile__footer">
                    <button className="button-link-container" style={{ maxHeight: "3em" }}>
                        <Link
                            className="text-lg font-bold"
                            to={`${post.id}`}
                        >
                            See more {iiicon("right-arrow", "var(--theme-accent-dark)")}
                        </Link>
                    </button>
                </div>
            </section>
        </>
    )
}

const OptionalPortfolioLinks: React.FC<{ portfolioLinks: string[] }> = ({ portfolioLinks }) => {
  const PortfolioLink: React.FC<{ icon: any, url: string, label: string }> = ({ icon, url, label }) => {
    return (
      <Link to={url} className="text-xs flex">
        <span className="mr-1">
          <PortfolioIcon site={icon} />
        </span>
        {label}
      </Link>
    );
  };

  return (
    <div className="mt-2 flex flex-row flex-wrap justify-unset gap-y-1 gap-x-2 fill-[var(--theme-accent-dark)]">
      {portfolioLinks.map((link: string) => {
        const data = getPortfolioLink(link);
        if (!data || !data.label) return <></>;
        return (<PortfolioLink key={`portfolio-link--${data.url}`} icon={data.icon} url={data.url} label={data.label} />);
      })}
    </div>
  );
};

const getPortfolioLink = (link: string) => {
  // TODO: Try/Catch
  let url: URL;
  try {
    url = new URL(link);
    url.protocol = "https"
    url.search = ""
  } catch {
    return undefined;
  }

  // List of supported portfolio sites
  const portfolioSites = [
    {
      host: 'itch.io',
      icon: 'itchio-small',
      label: (url: URL) => url.host.replace('.itch.io', ''),
    },
    {
      host: 'artstation.com',
      icon: 'artstation',
      label: (url: URL) => url.pathname.split('/')[1] || url.host.replace('.artstation.com', ''),
    },
    {
      host: 'deviantart.com',
      icon: 'deviantart',
      label: (url: URL) => url.pathname.split('/')[1] || url.host.replace('.deviantart.com', ''),
    },
    {
      host: 'github.com',
      icon: 'github',
      label: (url: URL) => url.pathname.split('/')[1] || url.host.replace('.github.com', ''),
    },
  ];

  for (const site of portfolioSites) {
    if (url.host.endsWith(site.host)) {
      return {
        icon: site.icon,
        url: url.toString(),
        label: site.label(url),
      };
    }
  }

  // fallback: just show the link
  return {
    icon: 'other',
    url: url.toString(),
    label: url.host,
  };
}

export const getDescriptionParagraphs = (post: Post) => {
    const maxNumberOfCharsToDisplay = 270;
    const maxNumberOfParasToDisplay = 4;

    const newlineNormalisedDescription = post.description.replaceAll(/\n+/g, "\n")
    const description = newlineNormalisedDescription.length > maxNumberOfCharsToDisplay
        ? newlineNormalisedDescription.substring(0, maxNumberOfCharsToDisplay - 3) + "..."
        : newlineNormalisedDescription

    return description
        .split("\n")
        .filter(para => para.trim().length > 0)
        .splice(0, maxNumberOfParasToDisplay)
}
