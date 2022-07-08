import React from "react";
import { StyledSelector } from "../../../components/StyledSelector/StyledSelector";
import { allSortBy, SortBy, sortByInfoMap } from "../../../model/sortBy";

interface Props {
  value: SortBy;
  onChange: (value: SortBy) => void;
  id?: string;
}

interface Option {
  value: SortBy;
  label: React.ReactNode;
}

const options = allSortBy.map((it) => ({
  value: it,
  label: (
    <span className="flex items-center">
      <span>{sortByInfoMap[it].friendlyName}</span>
    </span>
  ),
}));

const SortByMap = Object.fromEntries(
  options.map((it) => [it.value, it])
) as Record<SortBy, Option>;


export function SortBySelector({ id, value, onChange }: Props): React.ReactElement {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `.react-select__single-value {color: white!important;}`}} />
      <StyledSelector
        id={id}
        isMulti={false}
        closeMenuOnSelect={true}
        options={options}
        value={SortByMap[value]}
        onChange={(newValue) => newValue && onChange(newValue.value)}
      />
      </>
  );
}