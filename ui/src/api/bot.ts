import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Post,
  postFromApiResult,
  PostDTO,
} from '../common/models/post';
import { useApiRequest } from "./apiRequest";
import { useContext } from "react";
import { JamSpecificContext } from "../common/components/JamSpecificStyling.tsx";

// const CREATE_BOT_DM_QUERY_KEY = ["bot", "dm"] as const;

export interface CreateBotDmMutationVariables {
  recipientId: string;
}
export function useCreateBotDmMutation(
  opts?: UseMutationOptions<Post, Error, CreateBotDmMutationVariables>
): UseMutationResult<Post, Error, CreateBotDmMutationVariables> {
  const theme = useContext(JamSpecificContext);
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation({
    ...opts,
    mutationFn: async (variables) => {
      const result = await apiRequest<PostDTO>(`/${theme.jamId}/bot/dm`, {
        method: "POST",
        body: variables,
      });
      return postFromApiResult(result);
    },
    mutationKey: [theme.jamId, "bot", "dm"],
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries([theme.jamId, "bot", "dm"]);
      opts?.onSuccess?.(data, variables, context);
    },
  });
}
