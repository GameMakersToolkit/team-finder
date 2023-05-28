import React from "react";
import { StyledSelector } from "../../../components/StyledSelector/StyledSelector";
import { allSortOrders, SortOrder, sortOrderInfoMap, numericSortOrderInfoMap } from "../../../model/sortOrder";

interface Props {
  value: SortOrder;
  sortByValue: string;
  onChange: (value: SortOrder) => void;
  id?: string;
}

interface Option {
  value: SortOrder;
  label: React.ReactNode;
}

const getOptions = (sortByValue) => {
    return allSortOrders.map((sortOrder) => {
        const labelText = sortByValue == "size" ? numericSortOrderInfoMap[sortOrder].friendlyName : sortOrderInfoMap[sortOrder].friendlyName
        return ({
          value: sortOrder,
          label: (
            <span className="flex items-center">
              {labelText}
            </span>
          )
        })
    });
}
const getSortOrderMap = (sortByValue) => Object.fromEntries(
  getOptions(sortByValue).map((it) => [it.value, it])
) as Record<SortOrder, Option>;


export function SortOrderSelector({ id, value, sortByValue, onChange }: Props): React.ReactElement {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        `}} />
      <StyledSelector
        id={id}
        aria-label="Selector for how to sort search results by a sort type"
        isMulti={false}
        closeMenuOnSelect={true}
        options={getOptions(sortByValue)}
        value={getSortOrderMap(sortByValue)[value]}
        onChange={(newValue) => onChange(newValue.value)}
      />
    </>
  );
}
