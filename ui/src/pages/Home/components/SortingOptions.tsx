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
    <div className="sm:inline-block sm:float-right">
      Sort
      <span className="sm:inline-flex mx-2"><SortBySelector value={sortByValue} onChange={sortByOnChange}/></span>
      by
      <span className="sm:inline-flex mx-2"><SortOrderSelector value={sortOrderValue} onChange={sortOrderOnChange}/></span>
    </div>
  )
}