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

            {posts?.data?.length
                ? <PostsToDisplay posts={posts.data!} />
                : <NoPostsToDisplay isViewingBookmarks={isViewingBookmarks} />
            }
        </main>
    )
}

const PostsToDisplay: React.FC<{posts: Post[]}> = ({posts}) => {
    return (
        <div className="c-post-tiles">{posts.map(post => <PostTile key={post.id} post={post} />)}</div>
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