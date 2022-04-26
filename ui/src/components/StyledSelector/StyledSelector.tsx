import * as React from "react";
import Select from "react-select";
import { allSkills, skillInfoMap } from "../../model/skill";

const testOptions = allSkills.map((it) => ({
  value: it,
  label: skillInfoMap[it].friendlyName,
}));

export const StyledSelector: React.FC = () => {
  return (
    <Select
      isMulti={true}
      options={testOptions}
      className="styled-selector"
      classNamePrefix="react-select"
    />
  );
};
