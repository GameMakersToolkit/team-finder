import * as React from "react";
import {Skill, skillInfoMap} from "../model/skill";
import cx from "classnames";
import {SkillIcon} from "./SkillIcon";

export const SkillList: React.FC<{
    skills: Skill[];
    label: React.ReactNode;
    className?: string;
    showText: boolean
}> = ({skills, label, className, showText}) => {
    if (skills.length == 0) {
        return null;
    }

    return (
        <dl className={cx("flex gap-1 flex-wrap text-lg", className)}>
            <dt className={`py-1 ${showText ? "mr-1" : "block w-full sm:w-fit"}`}>{label}</dt>
            {skills.map((skill) => {
                const info = skillInfoMap[skill];
                return (
                    <dd
                        key={skill}
                        className={`py-1 border-2 border-[color:var(--skill-color)] flex items-center ${showText ? "px-2 sm:px-1" : "px-1"}`}
                    >
                        <SkillIcon
                            skill={skill}
                            className={`w-5 text-[color:var(--skill-color)] ${showText && "mr-1"}`}
                            aria-hidden={true}
                        />
                        {showText && <span className="text-sm">{info.friendlyName}</span>}
                    </dd>
                );
            })}
        </dl>
    );
};
