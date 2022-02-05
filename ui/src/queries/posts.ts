import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { apiRequest, toQueryString } from "../utils/apiRequest";

export type Skill = string; // TODO: literal union/enum
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
  return useQuery(
    ["posts", "list", searchOptions ?? {}],
    () => {
      const params = {
        ...searchOptions,
        skillsPossessed: searchOptions?.skillsPossessed?.join(","),
        skillsSought: searchOptions?.skillsSought?.join(","),
        languages: searchOptions?.languages?.join(","),
        availability: searchOptions?.availability?.join(","),
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
