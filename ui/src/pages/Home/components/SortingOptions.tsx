import React from "react";
import {SortOrderSelector} from "./SortOrderSelector";
import {SortOrder} from "../../../model/sortOrder";

export const SortingOptions: React.FC<{
  sortOrderValue: SortOrder;
  sortOrderOnChange: (value: SortOrder) => void;
}> = ({sortOrderValue, sortOrderOnChange}) => {
  return (
    <div>
      Sort by <span><SortOrderSelector value={sortOrderValue} onChange={sortOrderOnChange}/></span>
    </div>
  )
}