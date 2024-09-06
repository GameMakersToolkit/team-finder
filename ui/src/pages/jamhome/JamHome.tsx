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

export const JamHome: React.FC = () => {
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
        <JamSpecificStyling>
            <main>
                <Onboarding />
                <SiteIntro />
                <SearchFormWrapper searchParams={searchParams} setSearchParams={setSearchParams} />

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
    }
}> = ({pagination}) => {
    const [_, setSearchParams] = useSearchParams();

    const currentPage = pagination.current
    const maxPage = pagination.total

    const movePage = (diff: number) => {
        setTimeout(() => {
            document.getElementById('search-results')!.scrollIntoView({behavior: 'smooth'})
        }, 100)

        setSearchParams(params => {
            const newPage = currentPage <= maxPage ? Math.max(1, currentPage + diff) : maxPage;
            params.set("page", newPage.toString())
            return params
        })
    }

    const buttonClass = "w-[140px] py-2 border-2 border-[var(--theme-tile-border)] disabled:border-gray-500 rounded-xl font-bold text-center cursor-pointer"
    return (
        <div className="w-full flex justify-between pb-4">
            <button className={buttonClass} onClick={() => movePage(-1)} disabled={currentPage <= 1}>
                <span className={`flex justify-center mr-3 ${currentPage <= 1 ? `text-gray-500` : `text-[var(--theme-tile-border)]`}`}>
                    {iiicon("left-arrow", currentPage <= 1 ? "#6b7280" : "#78d7ff")} Page {Math.max(1, currentPage - 1)}
                </span>
            </button>

            <button className={buttonClass} onClick={() => movePage(1)} disabled={currentPage >= maxPage}>
                <span className={`flex justify-center ml-3 ${currentPage >= maxPage ? `text-gray-500` : `text-[var(--theme-tile-border)]`}`}>
                    Page {Math.min(maxPage, currentPage + 1)} {iiicon("right-arrow", currentPage >= maxPage ? "#6b7280" : "#78d7ff")}
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
