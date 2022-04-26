import * as React from "react";
import { SkillIcon } from "../components/SkillIcon";
import { StyledSelector } from "../components/StyledSelector/StyledSelector";
import { allSkills, Skill, skillInfoMap } from "../model/skill";

interface Props {
  value: Skill[];
  onChange: (value: Skill[]) => void;
  id?: string;
}

interface Option {
  value: Skill;
  label: React.ReactNode;
}

const options = allSkills.map((it) => ({
  value: it,
  label: (
    <span className="flex items-center">
      <SkillIcon className="inline-block w-5 mr-1" skill={it} />
      <span>{skillInfoMap[it].friendlyName}</span>
    </span>
  ),
}));

const optionsMap = Object.fromEntries(
  options.map((it) => [it.value, it])
) as Record<Skill, Option>;

export function SkillSelector({ id, value, onChange }: Props): React.ReactElement {
  return (
    <StyledSelector
      id={id}
      isMulti={true}
      options={options}
      value={value.map((it) => optionsMap[it])}
      onChange={(newValue) => onChange(newValue.map((it) => it.value))}
    />
  );
}
