import * as React from "react";
import { allSkills, Skill } from "../model/skill";

interface Props {
  value: Skill[];
  onChange: (value: Skill[]) => void;
}

export function SkillList({ value, onChange }: Props): React.ReactElement {
  return (
    <>
      {allSkills.map((skill) => {
        return (
          <label key={skill}>
            <input
              type="checkbox"
              checked={value?.includes(skill) ?? false}
              onChange={(e) => {
                let newList = value ?? [];
                if (e.currentTarget.checked && !newList.includes(skill)) {
                  newList = newList.concat([skill]);
                } else if (!e.currentTarget.checked) {
                  newList = newList.filter((it) => it !== skill);
                }
                onChange(newList);
              }}
            />
            {skill}
          </label>
        );
      })}
    </>
  );
}
