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
import {TimezoneOffset, timezoneOffsetInfoMap, timezoneOffsetToInt} from "../model/timezone";

const CREATE_BOT_DM_QUERY_KEY = ["bot", "dm"] as const;

export interface CreateBotDmMutationVariables {
  recipientId: string;
}
export function useCreateBotDmMutation(
  opts?: UseMutationOptions<Post, Error, CreateBotDmMutationVariables>
): UseMutationResult<Post, Error, CreateBotDmMutationVariables> {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation({
    ...opts,
    mutationFn: async (variables) => {
      const result = await apiRequest<PostApiResult>("/bot/dm", {
        method: "POST",
        body: variables,
      });
      return postFromApiResult(result);
    },
    mutationKey: ["bot", "dm"],
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries(CREATE_BOT_DM_QUERY_KEY);
      opts?.onSuccess?.(data, variables, context);
    },
  });
}
