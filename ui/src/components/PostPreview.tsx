import * as React from "react";
import cx from "classnames";
import { Post } from "../model/post";
import { Button } from "./Button";
import { useState } from "react";
import { PostModal } from "./PostModal";
import { SkillList } from "./SkillList";
import { useBanUser, useDeletePost } from "../queries/admin";
import { useFavouritePostMutation } from "../queries/posts";

interface Props {
  post: Post;
  className?: string;
  adminView?: boolean;
  adminId?: string;
  showSkillText: boolean;
}

export const PostPreview: React.FC<Props> = ({
  post,
  className,
  adminView,
  adminId,
  showSkillText
}) => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const deletePostMutation = useDeletePost();
  const banUserMutation = useBanUser();

  return (
    <article
      id={"post-" + post.id}
      className={cx(
        "relative border-2 border-white p-2 grid grid-flow-row auto-cols-auto gap-y-2",
        className
      )}
    >
      <h3 className="font-bold text-xl leading-6 h-[50px]">{post.title}</h3>
      <FavouritePostIndicator post={post} className={`absolute right-2 top-2 text-4xl text-neutral-600 cursor-pointer`} />
      <SkillList
        label="Looking for:"
        skills={post.skillsSought}
        className="[--skill-color:theme(colors.accent1)]"
        showText={showSkillText}
      />
      <SkillList
        label="Brings:"
        skills={post.skillsPossessed}
        className="[--skill-color:theme(colors.accent2)]"
        showText={showSkillText}
      />
      <p>{post.description.length <= 210 ? post.description : post.description.substring(0, 210) + "..."}</p>

      <PostModal
        post={post}
        isModalOpen={isModelOpen}
        setIsModalOpen={setIsModelOpen}
        showSkillText={showSkillText}
      />
      <div className={`flex ${adminView ? "justify-between" : "justify-end"}`}>
        {adminView && (
          <>
          <Button
            style={{ backgroundColor: "red" }}
            onClick={() => deletePostMutation.mutate({ postId: post.id })}
          >
            Delete Post
          </Button>
          <Button
            style={{ backgroundColor: "red" }}
            onClick={() => {
              deletePostMutation.mutate({ postId: post.id });
              banUserMutation.mutate({ discordId: post.authorId, adminId: adminId! });
            }}
          >
            Delete Post & Ban User
          </Button>
          </>
        )}
        <Button
          className="justify-self-end self-end"
          variant="primary"
          onClick={() => setIsModelOpen(true)}
          style={{color: "white"}}
        >
          More
        </Button>
      </div>
    </article>
  );
};

export const FavouritePostIndicator:React.FC<{
  post: Post;
  className: string;
}> = ({post, className}) => {
  const favouritePostMutation = useFavouritePostMutation();

  return (
    <span
      data-post-id={post.id}
      className={className}
      onClick={() => {
        post.isFavourite = !post.isFavourite // Set isFavourite in local context to immediately update UI (without waiting for API response)
        favouritePostMutation.mutate({ postId: post.id, isFavourite: post.isFavourite })
      }}
    >
      {/* TODO: Replace with nice SVGs */}
      {post.isFavourite ? `🤍` : `♡`}
    </span>
  )
}