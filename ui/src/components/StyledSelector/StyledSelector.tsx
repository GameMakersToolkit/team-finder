import * as React from "react";
import Select, { GroupBase, Props as ReactSelectProps } from "react-select";

export function StyledSelector<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: ReactSelectProps<Option, IsMulti, Group>) {
  return (
    <Select
      className="styled-selector"
      classNamePrefix="react-select"
      placeholder="Select option(s)"
      {...props}
    />
  );
}
