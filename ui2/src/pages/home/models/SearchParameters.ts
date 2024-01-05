// TODO: Fill out, consider what I'm doing here; just stuff to get in query string?
export type SearchParameters = {
    // Primary search term
    description?: string;
    //
    skillsPossessed?: string;
    skillsSought?: string;
    languages?: string;
    tools?: string;
    timezones?: string;

}

export const searchParametersFromQueryString = (queryParams: URLSearchParams): SearchParameters => {
    return {
        description: queryParams.get("description") || "",
    } as SearchParameters
}