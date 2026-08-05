import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";

export function useMutationWithInvalidation<TData, TVariables>(params: {
  mutationKey: QueryKey;
  invalidateKey: QueryKey;
  mutationFn: (variables: TVariables) => Promise<TData>;
  opts?: UseMutationOptions<TData, Error, TVariables>;
}): UseMutationResult<TData, Error, TVariables> {
  const queryClient = useQueryClient();

  return useMutation({
    ...params.opts,
    mutationKey: params.mutationKey,
    mutationFn: params.mutationFn,
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({ queryKey: params.invalidateKey });
      params.opts?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
