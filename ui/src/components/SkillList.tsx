import * as React from "react";
import {Skill, skillInfoMap} from "../model/skill";
import cx from "classnames";
import {SkillIcon} from "./SkillIcon";

export const SkillList: React.FC<{
    skills: Skill[];
    label: React.ReactNode;
    className?: string;
}> = ({skills, label, className}) => {
    if (skills.length == 0) {
        return null;
    }

    return (
        <dl className={cx("flex gap-1 flex-wrap text-lg", className)}>
            <dt className="py-1 mr-1">{label}</dt>
            {skills.map((skill) => {
                const info = skillInfoMap[skill];
                return (
                    <dd
                        key={skill}
                        className="py-1 px-2 border-2 border-[color:var(--skill-color)] flex items-center"
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
};
