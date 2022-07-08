import React from "react";
import { SortOrderSelector } from "./SortOrderSelector";
import { SortOrder } from "../../../model/sortOrder";
import { SortBySelector } from "./SortBySelector";
import { SortBy } from "../../../model/sortBy";

export const SortingOptions: React.FC<{
  sortByValue: SortBy;
  sortByOnChange: (value: SortBy) => void;
  sortOrderValue: SortOrder;
  sortOrderOnChange: (value: SortOrder) => void;
}> = ({sortByValue, sortByOnChange, sortOrderValue, sortOrderOnChange}) => {
  return (
    <div className="mt-2">
      Sort
      <span className="inline-flex mx-2"><SortBySelector value={sortByValue} onChange={sortByOnChange}/></span>
      by
      <span className="inline-flex mx-2"><SortOrderSelector value={sortOrderValue} onChange={sortOrderOnChange}/></span>
    </div>
  )
}