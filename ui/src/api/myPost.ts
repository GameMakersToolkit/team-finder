import {
  useQuery,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Post,
  postFromApiResult,
  PostDTO,
} from '../common/models/post';
import { expectNotFound, useApiRequest } from "./apiRequest";
import { useAuth } from "./AuthContext";
import { useUserInfo } from "./userInfo";
import { useContext } from "react";
import { JamSpecificContext } from "../common/components/JamSpecificStyling.tsx";

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
  const theme = useContext(JamSpecificContext);
  const hasAuth = Boolean(useAuth());
  const apiRequest = useApiRequest();
  return useQuery({
    queryKey: MY_POST_QUERY_KEY,
    queryFn: () =>
        expectNotFound(apiRequest<PostDTO>(`${theme.jamId}/posts/mine`)).then(
            (result) => result && postFromApiResult(result)
        ),
    ...{
      ...opts,
      enabled: hasAuth && (opts?.enabled ?? true),
    }
  });
}

export interface MyPostMutationVariables {
  description: string;
  size: number;
  skillsPossessed: string[];
  skillsSought: string[];
  preferredTools: string[];
  availability: string;
  timezoneOffsets: number[];
  languages: string[];
}

export function useMyPostMutation(
  opts?: UseMutationOptions<Post, Error, MyPostMutationVariables>
): UseMutationResult<Post, Error, MyPostMutationVariables> {
  const theme = useContext(JamSpecificContext)
  const userInfo = useUserInfo();
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();
  return useMutation({
    ...opts,
    mutationFn: async (variables) => {
      const existing = await queryClient.fetchQuery<PostDTO>({queryKey: MY_POST_QUERY_KEY});
      let result;

      if (existing) {
        result = await apiRequest<PostDTO>(`${theme.jamId}/posts/mine`, {
          method: "PUT",
          body: {
            ...variables,
            author: userInfo.data?.username,
          },
        });
      } else {
        result = await apiRequest<PostDTO>("/posts", {
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
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({queryKey: MY_POST_QUERY_KEY});
      opts?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export interface DeleteMyPostMutationVariables {
  postId: string;
}
export function useDeleteMyPostMutation(
  opts?: UseMutationOptions<Post, Error, DeleteMyPostMutationVariables>
): UseMutationResult<Post, Error, DeleteMyPostMutationVariables> {
  const theme = useContext(JamSpecificContext)
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();
  return useMutation({
    ...opts,
    mutationFn: async (variables) => {
      const result = await apiRequest<PostDTO>(`${theme.jamId}/posts/mine`, {
        method: "DELETE",
        body: variables,
      });
      return postFromApiResult(result);
    },
    mutationKey: [theme.jamId, "posts", "mine", "delete"],
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({queryKey: DELETE_MY_POST_QUERY_KEY});
      opts?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
