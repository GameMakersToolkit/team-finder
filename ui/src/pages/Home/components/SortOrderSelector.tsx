import React from "react";
import { StyledSelector } from "../../../components/StyledSelector/StyledSelector";
import { allSortOrders, SortOrder, sortOrderInfoMap } from "../../../model/sortOrder";

import ascIcon from "./icons/sort-asc.svg";
import descIcon from "./icons/sort-desc.svg";

interface Props {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
  id?: string;
}

interface Option {
  value: SortOrder;
  label: React.ReactNode;
}

const icons = {
    "asc": ascIcon,
    "desc": descIcon,
}

const options = allSortOrders.map((it) => ({
  value: it,
  label: (
    <span className="flex items-center">
        <img src={icons[it]} className="inline-block" width={20} height={20} style={{maxHeight: "20px"}}  alt={`Sort results ${sortOrderInfoMap[it].friendlyName}`}/>
    </span>
  ),
}));

const sortOrderMap = Object.fromEntries(
  options.map((it) => [it.value, it])
) as Record<SortOrder, Option>;


export function SortOrderSelector({ id, value, onChange }: Props): React.ReactElement {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        `}} />
      <StyledSelector
        id={id}
        isMulti={false}
        closeMenuOnSelect={true}
        options={options}
        value={sortOrderMap[value]}
        onChange={(newValue) => newValue && onChange(newValue.value)}
      />
    </>
  );
}