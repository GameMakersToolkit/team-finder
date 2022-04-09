import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import {
  Availability,
  PostApiResult,
  postFromApiResult,
  Post,
  SupportedLanguage,
} from "../model/post";
import { Skill } from "../model/skill";
import { toQueryString, useApiRequest } from "../utils/apiRequest";
import { sortArrayImmutably } from "../utils/fns";

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

type PostsListQueryKey = ["posts", "list", SearchOptions];

export function usePostsList(
  searchOptions?: SearchOptions,
  queryOptions?: UseQueryOptions<
    PostApiResult[],
    Error,
    Post[],
    PostsListQueryKey
  >
): UseQueryResult<Post[], Error> {
  const apiRequest = useApiRequest();

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
      return apiRequest<PostApiResult[]>(`/posts?${toQueryString(params)}`);
    },
    {
      ...queryOptions,
      select: (posts: PostApiResult[]) => posts.map(postFromApiResult),
    }
  );
}
