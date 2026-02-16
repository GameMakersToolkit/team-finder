export type SearchParameters = {
    availability: string[];
    jamId?: string;
    description: string;
    skillsPossessed: string[];
    skillsSought: string[];
    tools: string[];
    languages: string[];
    timezoneStart: string | undefined;
    timezoneEnd: string | undefined;
    sortBy: string;
    sortDir: string;
    bookmarked?: boolean | null;
}

export const blankSearchParameters: SearchParameters = {
    availability: [],
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
        availability: queryParams.get("availability")?.split(","),
        description: queryParams.get("description"),
        skillsPossessed: queryParams.get('skillsPossessed')?.split(","),
        skillsSought: queryParams.get('skillsSought')?.split(","),
        tools: queryParams.get('tools')?.split(","),
        languages: queryParams.get('languages')?.split(","),
        timezoneStart: queryParams.get("timezoneStart"),
        timezoneEnd: queryParams.get("timezoneEnd"),
        sortBy: queryParams.get('sortBy'),
        sortDir: queryParams.get('sortDir'),
        bookmarked: queryParams.has('bookmarked') ? "true" : null,
    } as SearchParameters
}
