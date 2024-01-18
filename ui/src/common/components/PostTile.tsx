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
                </header>

                <div className="post-tile__body">
                    <OptionsListDisplay optionsToDisplay={post.skillsSought} totalOptions={skills} label={"Looking for:"} className={"[--skill-color:theme(colors.theme-l-6)]"}/>
                    <OptionsListDisplay optionsToDisplay={post.skillsPossessed} totalOptions={skills} label={"Can do:"} className={"[--skill-color:theme(colors.theme-d-9)]"}/>
                    {getDescriptionParagraphs(post).map((line, idx) => <p dir="auto" key={idx} className="mb-2">{line}</p>)}
                </div>

                <div className="post-tile__footer">
                    <button className="button-link-container" style={{ maxHeight: "3em" }}>
                        <Link
                            className="text-lg text-theme-l-7 font-bold"
                            to={`/${post.id}`}
                        >
                            See more {iiicon("right-arrow", "#ff5762")}
                        </Link>
                    </button>
                </div>
            </section>
        </>
    )
}

const getDescriptionParagraphs = (post: Post) => {
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