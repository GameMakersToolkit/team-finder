import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { Post } from "../model/post";
import { expectNotFound, useApiRequest } from "../utils/apiRequest";
import { useAuth } from "../utils/AuthContext";

const USER_INFO_QUERY_KEY = ["posts", "mine"] as const;

export function useMyPostQuery(
  opts?: UseQueryOptions<
    Post | null,
    Error,
    Post | null,
    typeof USER_INFO_QUERY_KEY
  >
): UseQueryResult<Post | null, Error> {
  const hasAuth = Boolean(useAuth());
  const apiRequest = useApiRequest();
  return useQuery(
    USER_INFO_QUERY_KEY,
    () => expectNotFound(apiRequest<Post>("/posts/mine")),
    {
      ...opts,
      enabled: hasAuth && (opts?.enabled ?? true),
    }
  );
}
