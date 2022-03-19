import * as React from "react";
import cx from "classnames";
import { Post } from "../queries/posts";
import { Button } from "./Button";

interface Props {
  post: Post;
  className?: string;
}

export const PostPreview: React.FC<Props> = ({ post, className }) => {
  return (
    <article className={cx("border-2 border-white p-2 grid grid-flow-row auto-cols-auto gap-y-2", className)}>
      <h3 className="font-bold text-xl">[title goes here]</h3>
      <p>{post.description}</p>
      <Button className="justify-self-end">More</Button>
    </article>
  );
};
