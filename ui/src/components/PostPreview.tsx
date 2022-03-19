import * as React from "react";
import cx from "classnames";
import { ReactSVG } from "react-svg";
import { Post } from "../queries/posts";
import { Button } from "./Button";
import { skillInfoMap } from "../model/skill";
import { SkillIcon } from "./SkillIcon";

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
          {post.skillsSought.map((skill) => {
            const info = skillInfoMap[skill];
            return (
              <dd key={skill} className="py-1 px-2 border-2 border-accent1 flex items-center">
                <SkillIcon
                  skill={skill}
                  className="text-accent1 w-5 mr-1"
                  aria-hidden={true}
                />
                {info.friendlyName}
              </dd>
            );
          })}
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
