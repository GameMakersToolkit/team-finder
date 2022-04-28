import * as React from "react";
import { ToolIcon } from "../components/ToolIcon";
import { StyledSelector } from "../components/StyledSelector/StyledSelector";
import { allTools, Tool, toolInfoMap } from "../model/tool";

interface Props {
  value: Tool[];
  onChange: (value: Tool[]) => void;
  id?: string;
}

interface Option {
  value: Tool;
  label: React.ReactNode;
}

const options = allTools.map((it) => ({
  value: it,
  label: (
    <span className="flex items-center">
      <ToolIcon className="inline-block w-5 mr-1" tool={it} />
      <span>{toolInfoMap[it].friendlyName}</span>
    </span>
  ),
}));

const optionsMap = Object.fromEntries(
  options.map((it) => [it.value, it])
) as Record<Tool, Option>;

export function ToolSelector({ id, value, onChange }: Props): React.ReactElement {
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
