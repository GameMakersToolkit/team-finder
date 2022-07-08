export const allSortBy = [
  "id",
  "authorId",
  "size",
  "createdAt",
  "updatedAt",
] as const;

export type SortBy = typeof allSortBy[number];

export interface SortByInfo {
  friendlyName: string;
}

export const sortByInfoMap: Record<SortBy, SortByInfo> = {
  id:  {friendlyName: "Post ID"},
  authorId: {friendlyName: "Jammer"},
  size: {friendlyName: "Team Size"},
  createdAt: {friendlyName: "Creation Date"},
  updatedAt: {friendlyName: "Last Updated"},
};
