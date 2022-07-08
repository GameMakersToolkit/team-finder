import React from "react";
import { StyledSelector } from "../../../components/StyledSelector/StyledSelector";
import { allSortOrders, SortOrder, sortOrderInfoMap } from "../../../model/sortOrder";

interface Props {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
  id?: string;
}

interface Option {
  value: SortOrder;
  label: React.ReactNode;
}

const options = allSortOrders.map((it) => ({
  value: it,
  label: (
    <span className="flex items-center">
      <span>{sortOrderInfoMap[it].friendlyName}</span>
    </span>
  ),
}));

const sortOrderMap = Object.fromEntries(
  options.map((it) => [it.value, it])
) as Record<SortOrder, Option>;


export function SortOrderSelector({ id, value, onChange }: Props): React.ReactElement {
  return (
    <StyledSelector
      id={id}
      isMulti={false}
      closeMenuOnSelect={true}
      options={options}
      value={sortOrderMap[value]}
      onChange={(newValue) => onChange(newValue.value)}
    />
  );
}