import React, {useEffect, useState} from "react";
import { Post as PostModel } from "../../common/models/post.ts"
import {useParams} from "react-router-dom";
import {TeamSizeIcon} from "../../common/components/TeamSizeIcon.tsx";
import {SkillList} from "../../common/components/SkillList.tsx";

export const Post: React.FC<{}> = () => {

    const { postId } = useParams()
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
                </header>

                <div className="post__body">
                    <SkillList skillsToDisplay={post.skillsSought} label={"Looking for:"} className={"[--skill-color:theme(colors.blue-700)]"}/>
                    <SkillList skillsToDisplay={post.skillsPossessed} label={"Can do:"} className={"[--skill-color:theme(colors.indigo)]"}/>
                    {post.description.split("\n").map((line, idx) => <p dir="auto" key={idx} className="mb-1">{line}</p>)}
                </div>

                <div className="post__footer">
                </div>
            </section>
        </main>
    )
}