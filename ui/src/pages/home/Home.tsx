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
    const [previousPosts, setPreviousPosts] = useState<Post[]>([])
    const [searchParams, setSearchParams] = useSearchParams();
    const [isViewingBookmarks, setIsViewingBookmarks] = useState<boolean>(searchParams.get('bookmarked') === "true");

    const posts = usePosts();

    // Trigger API call every time query string changes
    // Not sure if we actually need react-query here, but I'm keeping it everywhere else for now to avoid unnecessary work
    useEffect(() => {
        const isOnlyBookmarked = searchParams.get('bookmarked') === "true"
        setIsViewingBookmarks(isOnlyBookmarked)
    }, [searchParams])

    return (
        <main>
            <Onboarding />
            <SiteIntro />
            <SearchFormWrapper searchParams={searchParams} setSearchParams={setSearchParams} />

            {previousPosts.length ? <PostsToDisplay posts={previousPosts} /> : <></>}

            {posts?.data?.length
                ?
                    <>
                        <PostsToDisplay posts={posts.data!} />
                        <LoadMorePostsButton currentPosts={posts.data!} previousPosts={previousPosts} isLoading={posts.isLoading} setPreviousPosts={setPreviousPosts} />
                    </>
                : <NoPostsToDisplay isViewingBookmarks={isViewingBookmarks} />
            }
        </main>
    )
}

const PostsToDisplay: React.FC<{
    posts: Post[],
}> = ({posts}) => {

    return (
        <div className="c-post-tiles mb-[1.5rem]">{posts.map(post => <PostTile key={post.id} post={post} />)}</div>
    )
}

const NoPostsToDisplay: React.FC<{isViewingBookmarks: boolean}> = ({isViewingBookmarks}) => {
    if (isViewingBookmarks) {
        return (
            <h2 className="text-xl text-center">You don't have any bookmarked posts</h2>
        )
    }

    return (
        <h2 className="text-xl text-center">Please wait...</h2>
    )
}

const LoadMorePostsButton: React.FC<{
    currentPosts: Post[],
    previousPosts: Post[],
    isLoading: boolean,
    setPreviousPosts: (posts: Post[]) => void
}> = ({currentPosts, previousPosts, isLoading, setPreviousPosts}) => {
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <button
            className="w-full mt-16 mb-8 px-4 py-4 border-2 border-theme-l-7 text-theme-l-7 rounded-xl font-bold text-center cursor-pointer"
            onClick={() => {
                setPreviousPosts([...currentPosts, ...previousPosts])
                const currentPage = parseInt(searchParams.get("page") || "1")
                setSearchParams(params => {
                    searchParams.set("page", String(currentPage + 1))
                    return params
                });
            }}
        >
            {isLoading ? `Loading...` : `Load more posts`}
        </button>
    )
}