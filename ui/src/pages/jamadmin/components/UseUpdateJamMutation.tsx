import { useMutation, UseMutationOptions, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { JamSpecificContext } from "../../../common/components/JamSpecificStyling.tsx";
import { useApiRequest } from "../../../api/apiRequest.ts";


interface UpdateJamMutationVariables {
  jamId: string;
  start: string;
  end: string;
  styles: object;
}

export function useUpdateJamMutation(
  opts?: UseMutationOptions<any, Error, UpdateJamMutationVariables>
): UseMutationResult<any, Error, UpdateJamMutationVariables> {
  const theme = useContext(JamSpecificContext);
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();
  const UPDATE_JAM_QUERY_KEY = ["jams", theme.jamId] as const;

  return useMutation({
    ...opts,
    mutationFn: async (variables) => {
      return await apiRequest(`/jams/${theme.jamId}`, {
        method: "PUT",
        body: variables
      });
    },
    mutationKey: UPDATE_JAM_QUERY_KEY,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey: UPDATE_JAM_QUERY_KEY });
      if (opts && typeof opts.onSuccess === "function") {
        opts.onSuccess(data, variables, context as any, undefined);
      }
    }
  });
}
