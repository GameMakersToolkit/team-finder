import {
  useQuery,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useQueryClient,
} from "react-query";
import { Availability, Post, PostApiResult, postFromApiResult } from "../model/post";
import { Skill } from "../model/skill";
import { expectNotFound, useApiRequest } from "../utils/apiRequest";
import { useAuth } from "../utils/AuthContext";

const MY_POST_QUERY_KEY = ["posts", "mine"] as const;

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
  title: string;
  description: string;
  skillsPossessed: Skill[],
  skillsSought: Skill[],
  preferredTools: string[],
  availability: Availability,
  timezoneStr: string,
  languages: string, // Shouldn't this be an array?
}

export function useMyPostMutation(
  opts?: UseMutationOptions<Post, Error, MyPostMutationVariables>
): UseMutationResult<Post, Error, MyPostMutationVariables> {
  const hasAuth = Boolean(useAuth());
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();
  return useMutation({
    ...opts,
    mutationFn: async (variables) => {
      const result = await apiRequest<PostApiResult>("/posts/mine", {
        method: "PUT",
        body: variables,
      });
      return postFromApiResult(result);
    },
    mutationKey: ["posts", "mine", "update"],
    onSuccess(data, variables, context) {
      queryClient.setQueryData(MY_POST_QUERY_KEY, data);
      opts?.onSuccess?.(data, variables, context);
    },
  });
}
