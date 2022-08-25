import {
  useQuery,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useQueryClient,
} from "react-query";
import { Availability } from "../model/availability";
import {
  Post,
  PostApiResult,
  postFromApiResult,
} from "../model/post";
import { Skill } from "../model/skill";
import { expectNotFound, useApiRequest } from "../utils/apiRequest";
import { useAuth } from "../utils/AuthContext";
import { useUserInfo } from "./userInfo";
import { timezoneOffsetToInt } from "../model/timezone";

const MY_POST_QUERY_KEY = ["posts", "mine"] as const;
const DELETE_MY_POST_QUERY_KEY = ["posts", "mine", "delete"] as const;

export function useMyPostQuery(
  opts?: UseQueryOptions<
    Post | null,
    Error,
    Post | null,
    typeof MY_POST_QUERY_KEY
  >
): UseQueryResult<Post | null, Error> {
  const hasAuth = Boolean(useAuth());
  const apiRequest = useApiRequest();
  return useQuery(
    MY_POST_QUERY_KEY,
    () =>
      expectNotFound(apiRequest<PostApiResult>("/posts/mine")).then(
        (result) => result && postFromApiResult(result)
      ),
    {
      ...opts,
      enabled: hasAuth && (opts?.enabled ?? true),
    }
  );
}

export interface MyPostMutationVariables {
  description: string;
  size: number;
  skillsPossessed: Skill[];
  skillsSought: Skill[];
  preferredTools: string[];
  availability: Availability;
  timezoneOffsets: number[];
  languages: string[];
}

export function useMyPostMutation(
  opts?: UseMutationOptions<Post, Error, MyPostMutationVariables>
): UseMutationResult<Post, Error, MyPostMutationVariables> {
  const userInfo = useUserInfo();
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();
  return useMutation({
    ...opts,
    mutationFn: async (variables) => {
      const existing = await queryClient.fetchQuery<PostApiResult>(
        MY_POST_QUERY_KEY
      );
      let result;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      variables.timezoneOffsets = variables.timezoneOffsets.map(str => timezoneOffsetToInt(str))

      if (existing) {
        result = await apiRequest<PostApiResult>("/posts/mine", {
          method: "PUT",
          body: {
            ...variables,
            author: userInfo.data?.username,
          },
        });
      } else {
        result = await apiRequest<PostApiResult>("/posts", {
          method: "POST",
          body: {
            ...variables,
            authorId: userInfo.data?.id,
            author: userInfo.data?.username,
          },
        });
      }
      return postFromApiResult(result);
    },
    mutationKey: ["posts", "mine", "update"],
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries(MY_POST_QUERY_KEY);
      opts?.onSuccess?.(data, variables, context);
    },
  });
}

export interface DeleteMyPostMutationVariables {
  id: string;
}
export function useDeleteMyPostMutation(
  opts?: UseMutationOptions<Post, Error, DeleteMyPostMutationVariables>
): UseMutationResult<Post, Error, DeleteMyPostMutationVariables> {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();
  return useMutation({
    ...opts,
    mutationFn: async (variables) => {
      const result = await apiRequest<PostApiResult>("/posts/mine", {
        method: "DELETE",
        body: variables,
      });
      return postFromApiResult(result);
    },
    mutationKey: ["posts", "mine", "delete"],
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries(DELETE_MY_POST_QUERY_KEY);
      opts?.onSuccess?.(data, variables, context);
    },
  });
}
