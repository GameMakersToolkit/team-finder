import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePagination } from "../../src/common/hooks/usePagination";

const setSearchParamsMock = vi.fn();

vi.mock("react-router-dom", () => ({
  useSearchParams: () => [new URLSearchParams(), setSearchParamsMock],
}));

describe("usePagination", () => {
  it("derives pagination state", () => {
    const { result } = renderHook(() => usePagination({ current: 2, total: 5 }));
    expect(result.current.canMoveBackward).toBe(true);
    expect(result.current.canMoveForward).toBe(true);
    expect(result.current.previousPage).toBe(1);
    expect(result.current.nextPage).toBe(3);
  });

  it("updates query params when moving page", () => {
    const { result } = renderHook(() => usePagination({ current: 2, total: 5 }));
    result.current.movePage(1);

    expect(setSearchParamsMock).toHaveBeenCalledTimes(1);
    const callback = setSearchParamsMock.mock.calls[0][0] as (params: URLSearchParams) => URLSearchParams;
    const next = callback(new URLSearchParams());
    expect(next.get("page")).toBe("3");
  });
});
