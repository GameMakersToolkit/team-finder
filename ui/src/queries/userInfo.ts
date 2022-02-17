import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { milliseconds } from "date-fns";
import { useApiRequest } from "../utils/apiRequest";
import { useAuth } from "../utils/AuthContext";

const USER_INFO_QUERY_KEY = ["userInfo"] as const;

export interface UserInfo {
  [key: string]: unknown;
}

export function useUserInfo(
  opts?: UseQueryOptions<UserInfo, Error, UserInfo, typeof USER_INFO_QUERY_KEY>
): UseQueryResult<UserInfo | null, Error> {
  const hasAuth = Boolean(useAuth());
  const apiRequest = useApiRequest();
  return useQuery(
    USER_INFO_QUERY_KEY,
    () => apiRequest<UserInfo>("/userinfo"),
    {
      ...opts,
      enabled: hasAuth && (opts?.enabled ?? true),
      staleTime: opts?.staleTime ?? milliseconds({ minutes: 5 }),
    }
  );
}
