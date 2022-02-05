import * as React from "react";
import type { useSearchParams } from "react-router-dom";

type SetSearchParamFn = ReturnType<typeof useSearchParams>[1];
type NavigateOptions = Parameters<SetSearchParamFn>[1];

export const useUpdateSearchParam = (
  searchParams: URLSearchParams,
  setSearchParams: SetSearchParamFn
) =>
  React.useCallback(
    (
      key: string,
      value: string | null,
      navigateOptions?: NavigateOptions
    ): void => {
      const newSearchParams = new URLSearchParams(searchParams);
      if (value == null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
      setSearchParams(newSearchParams.toString(), navigateOptions);
    },
    [searchParams, setSearchParams]
  );
