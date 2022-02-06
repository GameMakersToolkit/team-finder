import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { Skill } from "../model/skill";
import { apiRequest, toQueryString } from "../utils/apiRequest";
import { sortArrayImmutably } from "../utils/fns";

export type Availability = string; // TODO: literal union/enum
export type SupportedLanguage = string; // TODO: literal union/enum

export interface Post {
  id: number;
  author: string;
  authorId: string;
  description: string;
  skillsPossessed: Skill[];
  skillsSought: Skill[];
  availability: Availability;
  timezoneStr: string;
  languages: SupportedLanguage[];
  reportCount: number;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export type GetPost = Omit<Post, "createdAt" | "updatedAt" | "deletedAt"> & {
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

// this can be moved to a util if it keeps coming up
function transformDateOrNull(input: string | null): Date | null {
  if (input === null) {
    return null;
  }
  return new Date(input);
}

export type SortByOption = keyof Post;
export interface SearchOptions {
  description?: string;
  skillsPossessed?: Skill[];
  skillsSought?: Skill[];
  languages?: SupportedLanguage[];
  availability?: Availability[];
  sortBy?: SortByOption;
  sortDir?: "asc" | "desc";
}

export type PostsListQueryKey = ["posts", "list", SearchOptions];

export function usePostsList(
  searchOptions?: SearchOptions,
  queryOptions?: UseQueryOptions<GetPost[], Error, Post[], PostsListQueryKey>
): UseQueryResult<Post[], Error> {
  const normalizedSearchOptions: SearchOptions = {
    ...searchOptions,
    skillsPossessed:
      searchOptions?.skillsPossessed &&
      sortArrayImmutably(searchOptions.skillsPossessed),
    skillsSought:
      searchOptions?.skillsSought &&
      sortArrayImmutably(searchOptions.skillsSought),
    languages:
      searchOptions?.languages && sortArrayImmutably(searchOptions.languages),
    availability:
      searchOptions?.availability &&
      sortArrayImmutably(searchOptions.availability),
  };

  return useQuery(
    ["posts", "list", normalizedSearchOptions ?? {}],
    () => {
      const params = {
        ...normalizedSearchOptions,
        skillsPossessed: normalizedSearchOptions?.skillsPossessed?.join(","),
        skillsSought: normalizedSearchOptions?.skillsSought?.join(","),
        languages: normalizedSearchOptions?.languages?.join(","),
        availability: normalizedSearchOptions?.availability?.join(","),
      };
      return apiRequest<GetPost[]>(`/posts?${toQueryString(params)}`);
    },
    {
      ...queryOptions,
      select: (posts: GetPost[]) =>
        posts.map((post) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: transformDateOrNull(post.updatedAt),
          deletedAt: transformDateOrNull(post.deletedAt),
        })),
    }
  );
}
