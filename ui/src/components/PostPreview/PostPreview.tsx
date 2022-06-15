import * as React from "react";
import cx from "classnames";
import { Post } from "../../model/post";
import { Button } from "../Button";
import { useState } from "react";
import { PostModal } from "../PostModal";
import { SkillList } from "../SkillList";
import { useBanUser, useDeletePost } from "../../queries/admin";
import { FavouritePostIndicator } from "../FavouritePostIndicator";
import personIcon from "./person.svg";

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
  showSkillText,
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
      <PreviewTitle post={post} />
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
      <p className="break-all">
        {post.description.length <= 210
          ? post.description
          : post.description.substring(0, 210) + "..."}
      </p>

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
                banUserMutation.mutate({
                  discordId: post.authorId,
                  adminId: adminId!,
                });
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
          style={{ color: "white" }}
        >
          More
        </Button>
      </div>
    </article>
  );
};

export const PreviewTitle: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <div className="flex justify-between">
      <img src={personIcon} className="inline-block" width={48} height={48} />
      <span className="inline-block grow">
        <h3 className="text-2xl">
          {post.author.substring(0, post.author.length - 5)}
        </h3>
        <p>
          {post.size > 1
            ? `and ${post.size} others are looking for members`
            : `is looking for members`}
        </p>
      </span>
      <FavouritePostIndicator
        post={post}
        className={`right-2 top-2 text-4xl text-neutral-600 cursor-pointer`}
      />
    </div>
  );
};
