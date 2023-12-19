import React from "react";
import { StyledSelector } from "../StyledSelector/StyledSelector";
import {allLanguages, Language, languageInfoMap} from "../../model/language";

interface Props {
  value: Language[];
  onChange: (value: Language[]) => void;
  id?: string;
  required?: boolean;
}

interface Option {
  value: Language;
  label: React.ReactNode;
}

const options = allLanguages.map((it) => ({
  value: it,
  label: (
    <span className="flex items-center">
      <span>{languageInfoMap[it].friendlyName}</span>
    </span>
  ),
}));

const languagesMap = Object.fromEntries(
  options.map((it) => [it.value, it])
) as Record<Language, Option>;


export function LanguageSelector({ id, value, onChange, required }: Props): React.ReactElement {
  return (
    <StyledSelector
      id={id}
      isMulti={true}
      required={required}
      closeMenuOnSelect={false}
      options={options}
      value={value.map((it) => languagesMap[it])}
      onChange={(newValue) => onChange(newValue.map((it) => it.value))}
    />
  );
}