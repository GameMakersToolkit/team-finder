import * as React from "react";
import cx from "classnames";
import { Post } from "../model/post";
import { Button } from "./Button";
import { useState } from "react";
import { PostModal } from "./PostModal";
import { SkillList } from "./SkillList";
import { useBanUser, useDeletePost } from "../queries/admin";

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
        "border-2 border-white p-2 grid grid-flow-row auto-cols-auto gap-y-2",
        className
      )}
    >
      <h3 className="font-bold text-xl leading-6 h-[50px]">{post.title}</h3>
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
        >
          More
        </Button>
      </div>
    </article>
  );
};
