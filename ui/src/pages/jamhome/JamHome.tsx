import * as React from "react";
import {SearchFormWrapper} from "./components/SearchFormWrapper.tsx";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {PostTile} from "../../common/components/PostTile.tsx";
import {Onboarding} from "./components/Onboarding.tsx";
import {SiteIntro} from "./components/SiteIntro.tsx";
import {Post} from "../../common/models/post.ts";
import { JamSpecificStyling } from "../../common/components/JamSpecificStyling.tsx";
import {usePosts} from '../../api/post.ts';
import {iiicon} from '../../common/utils/iiicon.tsx';
import { usePagination } from "../../common/hooks/usePagination.ts";

export const JamHome: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isViewingBookmarks, setIsViewingBookmarks] = useState<boolean>(searchParams.get('bookmarked') === "true");

    const posts = usePosts(searchParams);

    // Trigger API call every time query string changes
    // Not sure if we actually need react-query here, but I'm keeping it everywhere else for now to avoid unnecessary work
    useEffect(() => {
        const isOnlyBookmarked = searchParams.get('bookmarked') === "true"
        setIsViewingBookmarks(isOnlyBookmarked)
    }, [searchParams])

    return (
        <JamSpecificStyling>
            <main>
                <Onboarding />
                <SiteIntro />
                <SearchFormWrapper
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    resultCounts={posts.data?.pagination}
                />

                {posts?.data?.pagination
                    ? <>
                        <div className="hidden sm:block"><PaginationButtons pagination={posts.data.pagination} /></div>
                        <h3 className="block sm:hidden text-center mb-4 text-gray-400">Page {posts.data.pagination.current}</h3>
                    </>
                    : <></>
                }

                <div id="posts-wrapper">
                    {posts?.data?.posts?.length
                        ? <PostsToDisplay posts={posts.data.posts} />
                        : <NoPostsToDisplay isLoading={posts.isLoading} isViewingBookmarks={isViewingBookmarks} />
                    }
                    <p>&nbsp;</p>
                </div>

                {posts?.data?.pagination ? <PaginationButtons pagination={posts.data?.pagination} /> : <></>}
            </main>
        </JamSpecificStyling>
    )
}

const PaginationButtons: React.FC<{
    pagination: {
        current: number;
        total: number;
        filteredCount: number;
        totalCount: number;
    }
}> = ({pagination}) => {
    const { canMoveBackward, canMoveForward, previousPage, nextPage, movePage } = usePagination(pagination);

    const buttonClass = "w-[140px] bg-[var(--theme-tile-bg)] py-2 border-2 border-[var(--theme-tile-border)] disabled:border-gray-500 disabled:cursor-not-allowed rounded-xl font-bold text-center cursor-pointer"
    return (
        <div className="w-full flex justify-between pb-4">
            <button className={buttonClass} onClick={() => movePage(-1)} disabled={!canMoveBackward}>
                <span className={`flex justify-center mr-3 ${!canMoveBackward ? `text-gray-500` : `text-[var(--theme-tile-border)]`}`}>
                    {iiicon("left-arrow", !canMoveBackward ? "#6b7280" : "var(--theme-tile-border)")} Page {previousPage}
                </span>
            </button>

            <button className={buttonClass} onClick={() => movePage(1)} disabled={!canMoveForward}>
                <span className={`flex justify-center ml-3 ${!canMoveForward ? `text-gray-500` : `text-[var(--theme-tile-border)]`}`}>
                    Page {nextPage} {iiicon("right-arrow", !canMoveForward ? "#6b7280" : "var(--theme-tile-border)")}
                </span>
            </button>
        </div>
    )
}

const PostsToDisplay: React.FC<{posts: Post[]}> = ({posts}) => {
    return (
        <div className="c-post-tiles">{posts.map(post => <PostTile key={post.id} post={post} />)}</div>
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
