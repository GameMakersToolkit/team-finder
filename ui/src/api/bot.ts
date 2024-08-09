import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from "react-query";
import {
  Post,
  PostResponseDTO,
  postFromApiResult,
} from "../common/models/post";
import { useApiRequest } from "./apiRequest";

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
      const result = await apiRequest<PostResponseDTO>("/bot/dm", {
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
