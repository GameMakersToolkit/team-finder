import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useEffect } from "react";
import { useApiRequest } from "./apiRequest";
import { useAuth, useAuthActions } from "./AuthContext";
import { getJamId } from "../common/utils/getJamId.ts";
import { UserInfo } from "../common/models/userInfo.ts";

const USER_INFO_QUERY_KEY = ["userInfo"] as const;

export function useUserInfo(
  opts?: UseQueryOptions<UserInfo, Error, UserInfo, typeof USER_INFO_QUERY_KEY>
): UseQueryResult<UserInfo | null, Error> {
  const jamId = getJamId()
  const hasAuth = Boolean(useAuth());
  const { logout } = useAuthActions();
  const apiRequest = useApiRequest();
  const queryResult = useQuery({
      queryKey: USER_INFO_QUERY_KEY,
      queryFn: () => apiRequest<UserInfo>(`/${jamId}/userinfo`),
      ...{
          ...opts,
          enabled: hasAuth && (opts?.enabled ?? true),
          staleTime: opts?.staleTime ?? 300000, // 5 minutes
          retry: opts?.retry ?? 0,
      }
  });

  useEffect(() => {
    if (queryResult.status === "error") {
      logout(jamId);
      window.location.reload();
    }
  }, [jamId, logout, queryResult.status]);

  return queryResult;
}
