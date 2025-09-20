import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useApiRequest } from "./apiRequest";
import { useAuth } from "./AuthContext";

const USER_INFO_QUERY_KEY = ["userInfo"] as const;

export interface UserInfo {
  [key: string]: unknown;
}

export function useUserInfo(
  opts?: UseQueryOptions<UserInfo, Error, UserInfo, typeof USER_INFO_QUERY_KEY>
): UseQueryResult<UserInfo | null, Error> {
  const hasAuth = Boolean(useAuth());
  const apiRequest = useApiRequest();
  return useQuery({
      queryKey: USER_INFO_QUERY_KEY,
      queryFn: () => apiRequest<UserInfo>("/userinfo"),
      ...{
          ...opts,
          enabled: hasAuth && (opts?.enabled ?? true),
          staleTime: opts?.staleTime ?? 300000, // 5 minutes
      }
  });
}
