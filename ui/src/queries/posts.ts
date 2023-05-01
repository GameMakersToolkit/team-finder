import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult
} from "react-query";
import { Availability } from "../model/availability";
import {
  PostApiResult,
  postFromApiResult,
  Post,
} from "../model/post";
import { Skill } from "../model/skill";
import { Tool } from "../model/tool";
import { toQueryString, useApiRequest } from "../utils/apiRequest";
import { sortArrayImmutably } from "../utils/fns";
import {SearchMode} from "../pages/Home/components/SearchModeSelector";

export type SortByOption = keyof Post;
export interface SearchOptions {
  limitToFavourites?: boolean;
  description?: string;
  skillsPossessed?: Skill[];
  skillsSought?: Skill[];
  tools?: Tool[];
  languages?: string[];
  availability?: Availability[];
  timezones?: string;
  sortBy?: SortByOption;
  sortDir?: "asc" | "desc";
  skillsPossessedSearchMode?: SearchMode;
  skillsSoughtSearchMode?: SearchMode;
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
    tools: searchOptions?.tools && sortArrayImmutably(searchOptions.tools),
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
        tools: normalizedSearchOptions?.tools?.join(","),
        languages: normalizedSearchOptions?.languages?.join(","),
        availability: normalizedSearchOptions?.availability?.join(","),
      };

      const route = params.limitToFavourites ? "posts/favourites" : "posts";
      delete params.limitToFavourites;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore toQueryString complains about `params.limitToFavourites` even though it doesn't exist anymore
      return apiRequest<PostApiResult[]>(`/${route}?${toQueryString(params)}`);
    },
    {
      ...queryOptions,
      select: (posts: PostApiResult[]) => posts.map(postFromApiResult),
    }
  );
}

export function usePostById(
  searchOptions: { postId: string },
  queryOptions?: UseQueryOptions<
    PostApiResult,
    Error,
    Post,
    ["posts", "get",  { postId: string }]
  >
): UseQueryResult<Post, Error> {
  const apiRequest = useApiRequest();

  return useQuery(
    ["posts", "get", searchOptions],
    () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      return apiRequest<PostApiResult>(`/posts/${searchOptions.postId}`);
    },
    {
      ...queryOptions,
      select: (post: PostApiResult) => postFromApiResult(post),
    }
  );
}

const REPORT_POST_QUERY_KEY = ["posts", "report"] as const;

export interface ReportPostMutationVariables {
  id: string;
}

export function useReportPostMutation(
    opts?: UseMutationOptions<void, Error, ReportPostMutationVariables>
): UseMutationResult<void, Error, ReportPostMutationVariables> {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();
  return useMutation({
    ...opts,
    mutationFn: async (variables) => {
      await apiRequest<void>("/posts/report", {
        method: "POST",
        body: variables,
      });
    },
    mutationKey: ["posts", "report"],
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries(REPORT_POST_QUERY_KEY);
      opts?.onSuccess?.(data, variables, context);
    }
  })
}

const REPORT_DMS_POST_QUERY_KEY = ["posts", "report-unable-to-contact"] as const;

export interface ReportBrokenDMsPostMutationVariables {
  id: string;
}

export function useReportBrokenDMsPostMutation(
    opts?: UseMutationOptions<void, Error, ReportBrokenDMsPostMutationVariables>
): UseMutationResult<void, Error, ReportBrokenDMsPostMutationVariables> {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();
  return useMutation({
    ...opts,
    mutationFn: async (variables) => {
      await apiRequest<void>("/posts/report-unable-to-contact", {
        method: "POST",
        body: variables,
      });
    },
    mutationKey: ["posts", "report-unable-to-contact"],
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries(REPORT_DMS_POST_QUERY_KEY);
      opts?.onSuccess?.(data, variables, context);
    }
  })
}

const FAVOURITE_POST_QUERY_KEY = ["posts", "favourite"] as const;

export interface FavouritePostMutationVariables {
  postId: string;
  isFavourite?: boolean;
}

export function useFavouritePostMutation(
  opts?: UseMutationOptions<Post, Error, FavouritePostMutationVariables>
): UseMutationResult<Post, Error, FavouritePostMutationVariables> {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();
  return useMutation({
    ...opts,
    mutationFn: async (variables) => {
      // If post is already favourited, use DELETE to remove Favourite status
      const method = variables.isFavourite ? "POST" : "DELETE";
      delete variables.isFavourite; // Don't submit this field, it's only used in the UI

      const result = await apiRequest<PostApiResult>("/favourites", {
        method: method,
        body: variables,
      });

      return postFromApiResult(result);
    },
    mutationKey: ["posts", "favourite"],
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries(FAVOURITE_POST_QUERY_KEY);
      opts?.onSuccess?.(data, variables, context);
    },
  });
}
