import * as React from "react";
import { toast } from "react-hot-toast";
import { Post } from "../../model/post";
import { useFavouritePostMutation } from "../../queries/posts";
import { useAuth } from "../../utils/AuthContext";
import { useUserInfo } from "../../queries/userInfo";
import favouriteSelectedIcon from "./favourite-selected-true.svg";
import favouriteNotSelectedIcon from "./favourite-selected-false.svg";

export const FavouritePostIndicator: React.FC<{
  post: Post;
  className: string;
}> = ({ post, className }) => {
  const auth = useAuth();
  const userInfo = useUserInfo();
  const favouritePostMutation = useFavouritePostMutation();

  const onClick = () => {
    if (!auth || userInfo.isLoading) {
      toast("You must be logged in to favourite a post", {
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
      <img
        src={
          post.isFavourite ? favouriteSelectedIcon : favouriteNotSelectedIcon
        }
        className="inline-block"
        style={{ width: "48px", height: "48px" }}
      />
    </span>
  );
};
