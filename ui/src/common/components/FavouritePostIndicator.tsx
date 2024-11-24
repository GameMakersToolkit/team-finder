import * as React from "react";
import { toast } from "react-hot-toast";
import {Post} from "../models/post.ts";
import {useAuth} from "../../api/AuthContext.tsx";
import {useUserInfo} from "../../api/userInfo.ts";
import {useFavouritePostMutation} from "../../api/post.ts";
import favouriteSelectedIcon from "../../assets/icons/bookmark/selected.svg"
import favouriteNotSelectedIcon from "../../assets/icons/bookmark/unselected.svg"
import {ReactSVG} from "react-svg";

export const FavouritePostIndicator: React.FC<{
    post: Post;
    className: string;
}> = ({ post, className }) => {
    const auth = useAuth();
    const userInfo = useUserInfo();
    const favouritePostMutation = useFavouritePostMutation();

    const onClick = () => {
        if (!auth || userInfo.isLoading) {
            toast("You must be logged in to bookmark a post", {
                icon: "🔒",
                id: "favourite-post-info",
            });
            return;
        }

        post.isFavourite = !post.isFavourite; // Set isFavourite in local context to immediately update UI (without waiting for API response)
        favouritePostMutation.mutate({
            postId: post.id,
            isFavourite: post.isFavourite,
        });
    };

    return (
        <span
            data-post-id={post.id}
            className={className + `${!auth && " cursor-pointer"}`}
            onClick={onClick}
        >
          <ReactSVG
              src={post.isFavourite ? favouriteSelectedIcon : favouriteNotSelectedIcon}
              desc={post.isFavourite ? `Click to remove ${post.author}'s post from your bookmarks` : `Click to add ${post.author}'s post to your bookmarks`}
              className="inline-block fill-[color:var(--theme-accent)]"
          />
    </span>
    );
};
