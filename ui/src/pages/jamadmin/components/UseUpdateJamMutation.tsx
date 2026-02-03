import { useMutation, UseMutationOptions, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { useApiRequest } from "../../../api/apiRequest.ts";
import { getJamId } from "../../../common/utils/getJamId.ts";


interface UpdateJamMutationVariables {
  jamId: string;
  start: string;
  end: string;
  styles: object;
}

export function useUpdateJamMutation(
  opts?: UseMutationOptions<any, Error, UpdateJamMutationVariables>
): UseMutationResult<any, Error, UpdateJamMutationVariables> {
  const jamId = getJamId();
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();
  const UPDATE_JAM_QUERY_KEY = ["jams", jamId] as const;

  return useMutation({
    ...opts,
    mutationFn: async (variables) => {
      return await apiRequest(`/jams/${jamId}`, {
        method: "PUT",
        body: variables
      });
    },
    mutationKey: UPDATE_JAM_QUERY_KEY,
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({ queryKey: ["jams", jamId] });
      opts?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
}
