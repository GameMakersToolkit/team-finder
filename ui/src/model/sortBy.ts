export const allSortBy = [
  "size",
  "createdAt",
  "updatedAt",
] as const;

export type SortBy = typeof allSortBy[number];

export interface SortByInfo {
  friendlyName: string;
}

export const sortByInfoMap: Record<SortBy, SortByInfo> = {
  size: {friendlyName: "Team Size"},
  createdAt: {friendlyName: "Date Created"},
  updatedAt: {friendlyName: "Last Updated"},
};
