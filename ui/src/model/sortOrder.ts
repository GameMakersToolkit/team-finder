export const allSortOrders = [
  "asc",
  "desc",
] as const;

export type SortOrder = typeof allSortOrders[number];

export interface SortOrderInfo {
  friendlyName: string;
}

export const sortOrderInfoMap: Record<SortOrder, SortOrderInfo> = {
  asc:  {friendlyName: "Ascending"},
  desc: {friendlyName: "Descending"},
};
