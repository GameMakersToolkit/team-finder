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
    <article
      className={cx(
        "border-2 border-white p-2 grid grid-flow-row auto-cols-auto gap-y-2",
        className
      )}
    >
      <h3 className="font-bold text-xl">[title goes here]</h3>
      {post.skillsSought.length && (
        <dl className="flex gap-1 flex-wrap text-lg">
          <dt className="py-1 mr-1">Looking for:</dt>
          {post.skillsSought.map((skill) => (
            <dd className="py-1 px-2 border-2 border-accent1" key={skill}>
              {skill}
            </dd>
          ))}
        </dl>
      )}
      {post.skillsPossessed.length && (
        <dl className="flex gap-1 flex-wrap text-lg">
          <dt className="py-1">Brings:</dt>
          {post.skillsPossessed.map((skill) => (
            <dd className="py-1 px-2 border-2 border-accent2" key={skill}>
              {skill}
            </dd>
          ))}
        </dl>
      )}
      <p>{post.description}</p>
      <Button className="justify-self-end">More</Button>
    </article>
  );
};
