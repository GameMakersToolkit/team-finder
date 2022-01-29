import * as React from "react";
import classnames from 'classnames';
import { skillsets as allSkillsets } from "../utils/Skillsets";
import { SkillsetSVG } from "./SkillsetSVG";

interface Props {
  selectedSkillsets: string[];
  onChange: (newValue: string[]) => void;
  className?: string;
  disabled?: boolean;
}
export const SkillsetSelector: React.FC<Props> = ({
  selectedSkillsets,
  onChange,
  className = "",
  disabled,
}) => {
  const toggleSelected = (skillId: string) => {
    if (selectedSkillsets.includes(skillId))
      onChange(selectedSkillsets.filter((id) => id != skillId));
    else onChange([...selectedSkillsets, skillId]);
  };

  return (
    <div
      className={classnames(
        "flex flex-col justify-center sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 min-w-max ",
        className,
        {
          "opacity-50": disabled,
        }
      )}
    >
      {allSkillsets.map((s) => {
        const color = disabled
          ? "fill-white cursor-not-allowed"
          : selectedSkillsets.includes(s.id)
          ? "fill-primary border-5"
          : "border-2 fill-white opacity-50 group-hover:opacity-100";

        return (
          <div
            data-skill={s.id}
            key={s.id}
            onClick={() => !disabled && toggleSelected(s.id)}
            className={
              "group items-center flex flex-row sm:block sm:text-center leading-tight sm:break-words align-top cursor-pointer sm:flex-1 sm:w-0 sm:max-w-[5rem]"
            }
          >
            <SkillsetSVG
              skillsetId={s.id}
              className={
                "mr-2 sm:mr-0 sm:mb-2 p-2 rounded w-12 sm:w-auto transition-all " +
                color
              }
            />
            <span>{s.name}</span>
          </div>
        );
      })}
    </div>
  );
};
