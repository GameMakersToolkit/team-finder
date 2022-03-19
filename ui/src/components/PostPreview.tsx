import * as React from "react";
import cx from "classnames";
import { Post } from "../queries/posts";
import { Button } from "./Button";
import { Skill, skillInfoMap } from "../model/skill";
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
      <SkillList
        label="Looking for:"
        skills={post.skillsSought}
        elementClassName="border-accent1"
        iconClassName="text-accent1"
      />
      <SkillList
        label="Looking for:"
        skills={post.skillsSought}
        elementClassName="border-accent2"
        iconClassName="text-accent2"
      />
      <p>{post.description}</p>
      <Button className="justify-self-end">More</Button>
    </article>
  );
};

const SkillList: React.FC<{
  skills: Skill[];
  label: React.ReactNode;
  className?: string;
  elementClassName?: string;
  iconClassName?: string;
}> = ({ skills, label, className, elementClassName, iconClassName }) => {
  if (skills.length) {
    return (
      <dl className={cx("flex gap-1 flex-wrap text-lg", className)}>
        <dt className="py-1 mr-1">{label}</dt>
        {skills.map((skill) => {
          const info = skillInfoMap[skill];
          return (
            <dd
              key={skill}
              className={cx(
                "py-1 px-2 border-2 flex items-center",
                elementClassName
              )}
            >
              <SkillIcon
                skill={skill}
                className={cx("w-5 mr-1", iconClassName)}
                aria-hidden={true}
              />
              {info.friendlyName}
            </dd>
          );
        })}
      </dl>
    );
  } else {
    return null;
  }
};
