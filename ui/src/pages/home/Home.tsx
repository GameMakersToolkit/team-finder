import * as React from "react";
import {SearchFormWrapper} from "./components/SearchFormWrapper.tsx";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {PostTile} from "../../common/components/PostTile.tsx";
import {Onboarding} from "./components/Onboarding.tsx";
import {SiteIntro} from "./components/SiteIntro.tsx";
import {useAuth} from "../../api/AuthContext.tsx";
import {Post} from "../../common/models/post.ts";

export const Home: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState<Post[]>([])
    const { token } = useAuth() ?? {};

    // Trigger API call every time query string changes
    // Not sure if we actually need react-query here, but I'm keeping it everywhere else for now to avoid unnecessary work
    useEffect(() => {
        const path = searchParams.get('bookmarked') === "true" ? "posts/favourites" : "posts"
        searchParams.delete('bookmarked')

        const url = new URL(path + "?" + searchParams.toString(), import.meta.env.VITE_API_URL)
        const init: RequestInit = {method: "GET", headers: {"Content-Type": "application/json"}}

        if (token) {
            // @ts-ignore
            init.headers['Authorization'] = `Bearer ${token}`
        }

        fetch(url, init)
            .then(res => res.json())
            .then(setPosts)
    }, [searchParams])

    // console.log(posts)

    return (
        <main>
            <Onboarding />
            <SiteIntro />
            <SearchFormWrapper searchParams={searchParams} setSearchParams={setSearchParams} />

            {posts?.length > 0
                ? (<div className="c-post-tiles">{posts.map(post => <PostTile key={post.id} post={post} />)}</div>)
                : (<h2 className="text-xl text-center">Please wait...</h2>)
            }
        </main>
    )
}