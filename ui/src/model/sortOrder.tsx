import React from "react";
import { iiicon } from "../utils/iiicon";

export const allSortOrders = [
  "asc",
  "desc",
] as const;

export type SortOrder = typeof allSortOrders[number];

export interface SortOrderInfo {
  friendlyName: any;
}

export const sortOrderInfoMap: Record<SortOrder, SortOrderInfo> = {
  asc:  {friendlyName: <><span className="mr-1">Oldest</span>{iiicon('right-arrow', '#000000', 12, 12)}<span className="ml-1">Newest</span></>},
  desc: {friendlyName: <><span className="mr-1">Newest</span>{iiicon('right-arrow', '#000000', 12, 12)}<span className="ml-1">Oldest</span></>},
};

export const numericSortOrderInfoMap: Record<SortOrder, SortOrderInfo> = {
  asc: {friendlyName: <><span className="mr-1">Least</span>{iiicon('right-arrow', '#000000', 12, 12)}<span className="ml-1">Most</span></>},
  desc: {friendlyName: <><span className="mr-1">Most</span>{iiicon('right-arrow', '#000000', 12, 12)}<span className="ml-1">Least</span></>},
}