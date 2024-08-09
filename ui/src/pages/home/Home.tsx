import * as React from "react";
import {SearchFormWrapper} from "./components/SearchFormWrapper.tsx";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {PostTile} from "../../common/components/PostTile.tsx";
import {Onboarding} from "./components/Onboarding.tsx";
import {SiteIntro} from "./components/SiteIntro.tsx";
import {Post} from '../../common/models/post.ts';
import {usePosts} from '../../api/post.ts';
import {iiicon} from '../../common/utils/iiicon.tsx';

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
        console.log("Smooth scroll!")

        setSearchParams(params => {
            const newPage = currentPage <= maxPage ? Math.max(1, currentPage + diff) : maxPage;
            params.set("page", newPage.toString())
            return params
        })
    }

    const buttonClass = "w-[140px] h-[60px] py-2 border-2 border-theme-l-7 disabled:border-gray-500 rounded-xl font-bold text-center cursor-pointer"
    return (
        <div className="w-full flex justify-between pb-4">
            <button className={buttonClass} onClick={() => movePage(-1)} disabled={currentPage <= 1}>
                <span className={`flex justify-center ${currentPage <= 1 ? `text-gray-500` : `text-theme-l-7`}`}>
                    {iiicon("left-arrow", currentPage <= 1 ? "#6b7280" : "#ff5762")} Page {Math.max(1, currentPage - 1)}
                </span>
            </button>

            <button className={buttonClass} onClick={() => movePage(1)} disabled={currentPage >= maxPage}>
                <span className={`flex justify-center ${currentPage >= maxPage ? `text-gray-500` : `text-theme-l-7`}`}>
                    Page {Math.min(maxPage, currentPage + 1)} {iiicon("right-arrow", currentPage >= maxPage ? "#6b7280" : "#ff5762")}
                </span>
            </button>
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