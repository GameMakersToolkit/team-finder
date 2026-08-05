import { useSearchParams } from "react-router-dom";

export interface PaginationState {
  current: number;
  total: number;
}

export function usePagination(pagination: PaginationState) {
  const [, setSearchParams] = useSearchParams();

  const currentPage = pagination.current;
  const maxPage = pagination.total;

  const movePage = (diff: number) => {
    const nextPage = currentPage <= maxPage ? Math.max(1, Math.min(maxPage, currentPage + diff)) : maxPage;

    setSearchParams((params) => {
      params.set("page", nextPage.toString());
      return params;
    });

    setTimeout(() => {
      document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return {
    currentPage,
    maxPage,
    canMoveBackward: currentPage > 1,
    canMoveForward: currentPage < maxPage,
    previousPage: Math.max(1, currentPage - 1),
    nextPage: Math.min(maxPage, currentPage + 1),
    movePage,
  };
}
