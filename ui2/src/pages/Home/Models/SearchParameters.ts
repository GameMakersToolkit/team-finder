export type SearchParameters = {
    // Primary search term
    description: string
}

export const searchParametersFromQueryString = (queryParams: URLSearchParams): SearchParameters => {
    return {
        description: queryParams.get("description") || "",
    } as SearchParameters
}