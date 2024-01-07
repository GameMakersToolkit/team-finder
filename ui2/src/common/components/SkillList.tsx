import * as React from "react";
import {skills} from "../models/skills.tsx";

export const SkillList: React.FC<{
    skillsToDisplay: string[];
    label: React.ReactNode;
    className?: string;
}> = ({skillsToDisplay, label, className}) => {
    if (skillsToDisplay.length == 0) {
        return null;
    }

    return (
        <dl className={"flex gap-[8px] flex-wrap self-baseline items-baseline text-lg " + className}>
            <dt className={`self-center mr-1`}>{label}</dt>
            {skillsToDisplay.map((skill) => {
                const info = skills.filter(s => s.value == skill)[0];
                return (
                    <dd
                        key={skill}
                        className={`py-1 border-2 border-[color:var(--skill-color)] bg-[color:var(--skill-color)] rounded-xl flex items-center px-2 sm:px-1}`}
                    >
                        <span className="text-sm">{info.label}</span>
                    </dd>
                );
            })}
        </dl>
    );
};
