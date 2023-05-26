export const allSortOrders = [
  "asc",
  "desc",
] as const;

export type SortOrder = typeof allSortOrders[number];

export interface SortOrderInfo {
  friendlyName: string;
}

export const sortOrderInfoMap: Record<SortOrder, SortOrderInfo> = {
  asc:  {friendlyName: `Oldest → Newest`},
  desc: {friendlyName: `Newest → Oldest`},
};

export const numericSortOrderInfoMap: Record<SortOrder, SortOrderInfo> = {
  asc: {friendlyName: `Least → Most`},
  desc: {friendlyName: `Most → Least`},
}