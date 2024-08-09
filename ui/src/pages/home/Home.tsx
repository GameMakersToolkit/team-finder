import * as React from "react";
import {VariableSizeGrid} from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
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

    const loadNextPage = (startIndex: number, stopIndex: number) => {
        console.log("Load next page!")
        return new Promise(() => true).then(() => console.log(startIndex, stopIndex))
    }

    return (
        <main>
            <Onboarding />
            <SiteIntro />
            <SearchFormWrapper searchParams={searchParams} setSearchParams={setSearchParams} />

            {posts?.data?.length
                ? <PostsToDisplay isItemLoaded={() => posts.isSuccess} posts={posts.data!} loadMoreItems={posts.isLoading ? () => {} : loadNextPage} />
                : <NoPostsToDisplay isViewingBookmarks={isViewingBookmarks} />
            }
        </main>
    )
}

const PostsToDisplay: React.FC<{
    posts: Post[];
    isItemLoaded: (index: number) => boolean;
    loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void> | void;
}> = ({posts, isItemLoaded, loadMoreItems}) => {
    console.log(posts)
    // </div>
    return (
        <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={1000}
            loadMoreItems={loadMoreItems}
            minimumBatchSize={1}
            threshold={1}
        >
            {({ onItemsRendered, ref }) => (
                <VariableSizeGrid
                    ref={ref}
                    className="c-post-tiles-wrapper w-full"
                    style={{width: "100%", height: "100vh"}}
                    height={1}
                    width={1}
                    columnCount={1}
                    rowCount={1}
                    columnWidth={() => 0}
                    rowHeight={() => 1}
                    itemData={posts}
                    onItemsRendered={() => onItemsRendered}
                >
                    {((index) => (
                        <div className="c-post-tiles">
                            {index.data.map(post => <PostTile key={post.id} post={post} />)}
                        </div>
                    ))}
                </VariableSizeGrid>
            )}
        </InfiniteLoader>
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