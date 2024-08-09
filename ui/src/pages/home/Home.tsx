import * as React from "react";
import {SearchFormWrapper} from "./components/SearchFormWrapper.tsx";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {PostTile} from "../../common/components/PostTile.tsx";
import {Onboarding} from "./components/Onboarding.tsx";
import {SiteIntro} from "./components/SiteIntro.tsx";
import {Post} from '../../common/models/post.ts';
import {usePosts} from '../../api/post.ts';

export const Home: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isViewingBookmarks, setIsViewingBookmarks] = useState<boolean>(searchParams.get('bookmarked') === "true");

    const posts = usePosts();

    useEffect(() => {
        const isOnlyBookmarked = searchParams.get('bookmarked') === "true"
        setIsViewingBookmarks(isOnlyBookmarked)
    }, [searchParams])

    return (
        <main>
            <Onboarding />
            <SiteIntro />
            <SearchFormWrapper searchParams={searchParams} setSearchParams={setSearchParams} />

            <PaginationButtons posts={posts.data!} />

            <div id="posts-wrapper">
                {posts?.data?.length
                    ? <PostsToDisplay posts={posts.data!} />
                    : <NoPostsToDisplay isLoading={posts.isLoading} isViewingBookmarks={isViewingBookmarks} />
                }
                <p>&nbsp;</p>
            </div>

            <PaginationButtons posts={posts.data!} />
        </main>
    )
}

const PaginationButtons: React.FC<{posts: Post[]}> = ({posts}) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const getCurrentPage = () => parseInt(searchParams.get("page") ?? "1");
    const movePage = (diff: number) => {
        setSearchParams(params => {
            const newPage = posts.length > 0 ? Math.max(1, getCurrentPage() + diff) : getCurrentPage();
            params.set("page", newPage.toString())
            return params
        })
    }

    const buttonClass = "w-[140px] py-2 border-2 border-theme-l-7 text-theme-l-7 rounded-xl font-bold text-center cursor-pointer"
    return (
        <div className="w-full flex justify-between pb-4">
            {getCurrentPage() > 1 ? <button className={buttonClass} onClick={() => movePage(-1)}>Previous</button> : <>&nbsp;</>}

            <button className={buttonClass} onClick={() => movePage(1)}>Next</button>
        </div>
    )
}

const PostsToDisplay: React.FC<{posts: Post[]}> = ({posts}) => {
    return (
        <>
            <div id="posts" className="c-post-tiles pb-4">{posts.map(post => <PostTile key={post.id} post={post} />)}</div>
        </>
    )
}

const NoPostsToDisplay: React.FC<{
    isLoading: boolean;
    isViewingBookmarks: boolean;
}> = ({isLoading, isViewingBookmarks}) => {
    if (isLoading) {
        return (
            <h2 className="text-xl text-center h-[800px]">Loading, please wait...</h2>
        )
    }

    if (isViewingBookmarks) {
        return (
            <h2 className="text-xl text-center">No bookmarked posts available.</h2>
        )
    }

    return (
        <h2 className="text-xl text-center">No posts available.</h2>
    )
}