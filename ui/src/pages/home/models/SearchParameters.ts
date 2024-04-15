export type SearchParameters = {
    description: string;
    skillsPossessed: string[];
    skillsSought: string[];
    tools: string[];
    languages: string[];
    timezoneStart: string | undefined;
    timezoneEnd: string | undefined;
    sortBy: string;
    sortDir: string;
    bookmarked?: string;
}

export const blankSearchParameters: SearchParameters = {
    description: "",
    skillsPossessed: [],
    skillsSought: [],
    tools: [],
    languages: [],
    timezoneStart: undefined,
    timezoneEnd: undefined,
    sortBy: "",
    sortDir: "",
}

export const searchParametersFromQueryString = (queryParams: URLSearchParams): SearchParameters => {
    return {
        ...blankSearchParameters,
        description: queryParams.get("description"),
        skillsPossessed: queryParams.get('skillsPossessed')?.split(","),
        skillsSought: queryParams.get('skillsSought')?.split(","),
        tools: queryParams.get('tools')?.split(","),
        languages: queryParams.get('languages')?.split(","),
        timezoneStart: queryParams.get("timezoneStart"),
        timezoneEnd: queryParams.get("timezoneEnd"),
        sortBy: queryParams.get('sortBy'),
        sortDir: queryParams.get('sortDir'),
        bookmarked: queryParams.get('bookmarked')
    } as SearchParameters
}