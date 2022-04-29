import * as React from "react";
import cx from "classnames";
import { Post } from "../model/post";
import { Button } from "./Button";
import { Skill, skillInfoMap } from "../model/skill";
import { SkillIcon } from "./SkillIcon";

interface Props {
  post: Post;
  className?: string;
  adminView?: boolean;
  deletePost?: (post: Post) => void;
}

export const PostPreview: React.FC<Props> = ({ post, className, adminView, deletePost }) => {
  return (
    <article
      className={cx(
        "border-2 border-white p-2 grid grid-flow-row auto-cols-auto gap-y-2",
        className
      )}
    >
      <h3 className="font-bold text-xl">{post.title}</h3>
      <SkillList
        label="Looking for:"
        skills={post.skillsSought}
        className="[--skill-color:theme(colors.accent1)]"
      />
      <SkillList
        label="Brings:"
        skills={post.skillsPossessed}
        className="[--skill-color:theme(colors.accent2)]"
      />
      <p>{post.description}</p>

      <div className={`flex ${adminView ? "justify-between" : "justify-end"}`}>
        {adminView && <Button style={{backgroundColor: "red"}} onClick={() => deletePost!(post)}>Delete</Button>}
        <Button>More</Button>
      </div>
    </article>
  );
};

const SkillList: React.FC<{
  skills: Skill[];
  label: React.ReactNode;
  className?: string;
}> = ({ skills, label, className }) => {
  if (skills.length) {
    return (
      <dl className={cx("flex gap-1 flex-wrap text-lg", className)}>
        <dt className="py-1 mr-1">{label}</dt>
        {skills.map((skill) => {
          const info = skillInfoMap[skill];
          return (
            <dd
              key={skill}
              className={
                "py-1 px-2 border-2 border-[color:var(--skill-color)] flex items-center"
              }
            >
              <SkillIcon
                skill={skill}
                className={"w-5 mr-1 text-[color:var(--skill-color)]"}
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
