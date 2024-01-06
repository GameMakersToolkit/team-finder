import React from "react";
import {Post} from "../models/post.ts";
import {TeamSizeIcon} from "./TeamSizeIcon.tsx";

export const PostTile: React.FC<{post: Post}> = ({post}) => {
    return (
        <>
            <div className="c-post-tile">
                <div className="post-tile__header">
                    <TeamSizeIcon size={post.size} />
                    <h3 className="post-tile__header--title">{post.author}</h3>
                </div>

                <div className="post-tile__body">

                </div>

                <div className="post-tile__footer">

                </div>
            </div>
        </>
    )
}