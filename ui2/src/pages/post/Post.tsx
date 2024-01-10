import React, {useEffect, useState} from "react";
import { Post as PostModel } from "../../common/models/post.ts"
import {useNavigate, useParams} from "react-router-dom";
import {TeamSizeIcon} from "../../common/components/TeamSizeIcon.tsx";
import {OptionsListDisplay} from "../../common/components/OptionsListDisplay.tsx";
import {skills} from "../../common/models/skills.tsx";
import {tools} from "../../common/models/engines.tsx";
import {languages} from "../../common/models/languages.ts";
import {timezones} from "../../common/models/timezones.ts";

export const Post: React.FC<{}> = () => {

    const { postId } = useParams()
    const navigate = useNavigate();
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
        <>
            <header className="container mx-auto px-4 pb-6 pt-4 text-xl">
                <a className="text-grey-200 mr-2 cursor-pointer hover:underline" onClick={() => navigate(-1)}>Search results</a>
                <span className="mr-2">&gt;</span>
                {/*<span className="mr-2">{iiicon('right-arrow', "#FFFFFF", 16, 16)}</span>*/}
                <span>{post.author}</span>
            </header>

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
                        <OptionsListDisplay optionsToDisplay={post.skillsSought} totalOptions={skills} label={"Looking for:"} className={"[--skill-color:theme(colors.blue-700)]"}/>
                        <OptionsListDisplay optionsToDisplay={post.skillsPossessed} totalOptions={skills} label={"Can do:"} className={"[--skill-color:theme(colors.indigo)]"}/>
                        <OptionsListDisplay optionsToDisplay={post.preferredTools} totalOptions={tools} label={"Preferred Engine(s):"} className={"[--skill-color:theme(colors.grey-300)]"}/>
                        <OptionsListDisplay optionsToDisplay={post.languages} totalOptions={languages} label={"Language(s):"} className={"[--skill-color:theme(colors.grey-800)]"}/>
                        <OptionsListDisplay optionsToDisplay={post.timezoneOffsets} totalOptions={timezones} label={"Timezone(s):"} className={"[--skill-color:theme(colors.grey-500)]"}/>
                        {post.description.split("\n").map((line, idx) => <p dir="auto" key={idx} className="mb-1">{line}</p>)}
                    </div>

                    <div className="post__footer">
                    </div>
                </section>
            </main>
        </>
    )
}