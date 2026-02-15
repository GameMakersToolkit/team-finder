import React from "react";
import {Post} from "../models/post.ts";
import {TeamSizeIcon} from "./TeamSizeIcon.tsx";
import {Link} from "react-router-dom";
import {OptionsListDisplay} from "./OptionsListDisplay.tsx";
import {skills} from "../models/skills.tsx";
import {FavouritePostIndicator} from "./FavouritePostIndicator.tsx";
import {iiicon} from "../utils/iiicon.tsx";

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

const OptionalPortfolioLinks = ({portfolioLinks}) => {
    const PortfolioLink: React.FC<{icon: any, url: string, label: string}> = ({icon, url, label}) => {
        return (
            <Link to={url} className="text-xs text-gray-400 flex">
              <span className="mr-1">{icon}</span>
              {label}
            </Link>
        )
    }

  return portfolioLinks.map(link => {
    const data = getPortfolioLink(link)
    console.log(data)
    if (!data || !data.label) return <></>
    return (<PortfolioLink icon={data.icon} url={data.url} label={data.label} />)
  })
}

const getPortfolioLink = (link: string) => {
  // TODO: Try/Catch
  let url = new URL(link)
  if (url.host.endsWith("itch.io")) {
    return {
      icon: iiicon('itchio-small', '#9ca3af', 16, 16),
      url: url.toString(),
      label: url.host.replace(".itch.io", "")
    }
  }
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
