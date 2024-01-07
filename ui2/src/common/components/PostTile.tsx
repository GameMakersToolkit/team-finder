import React from "react";
import {Post} from "../models/post.ts";
import {TeamSizeIcon} from "./TeamSizeIcon.tsx";
import {Link} from "react-router-dom";
import {SkillList} from "./SkillList.tsx";

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
                </header>

                <div className="post-tile__body">
                    <SkillList skillsToDisplay={post.skillsSought} label={"Looking for:"} className={"[--skill-color:theme(colors.blue-700)]"}/>
                    <SkillList skillsToDisplay={post.skillsPossessed} label={"Can do:"} className={"[--skill-color:theme(colors.indigo)]"}/>
                    {getDescriptionParagraphs(post).map((line, idx) => <p dir="auto" key={idx} className="mb-1">{line}</p>)}
                </div>

                <div className="post-tile__footer">
                    <button className="button-link-container" style={{ maxHeight: "3em" }}>
                        <Link
                            className="text-lg text-blue-200 font-bold"
                            to={`/${post.id}`}
                        >
                            {/*See more {iiicon("right-arrow", "#8ae7ff")}*/}
                            See more {">"}
                        </Link>
                    </button>
                </div>
            </section>
        </>
    )
}

const getDescriptionParagraphs = (post: Post) => {
    const description = post.description.length > 210 ? post.description.substring(0, 207) + "..." : post.description
    const numberOfParasToDisplay = 4
    const descriptionParagraphs = description.split("\n").splice(0, numberOfParasToDisplay)
    if (description.split("\n").length > numberOfParasToDisplay) {
        descriptionParagraphs.push("...")
    }

    return descriptionParagraphs
}