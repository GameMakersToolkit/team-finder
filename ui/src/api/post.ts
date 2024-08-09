import {
    useMutation,
    UseMutationOptions,
    UseMutationResult,
    useQuery,
    useQueryClient,
    UseQueryResult
} from 'react-query';
import {useApiRequest} from "./apiRequest.ts";
import {Post, PostResponseDTO, postFromApiResult, PostResponse, PostDTO} from '../common/models/post.ts';
import {useAuth} from './AuthContext.tsx';
import {useSearchParams} from 'react-router-dom';

export function usePosts(): UseQueryResult<PostResponse, Error> {
    const [searchParams, _] = useSearchParams();
    const { token } = useAuth() ?? {};
    const apiRequest = useApiRequest();

    const isOnlyBookmarked = searchParams.get('bookmarked') === "true"
    const path = isOnlyBookmarked ? "posts/favourites" : "posts"
    const url = `/${path}?${searchParams}`

    return useQuery(
        ["posts", "list", searchParams.toString() ?? ""],
        () => {
            return apiRequest<PostResponseDTO>(url, {method: "GET", authToken: token});
        },
        {
            select: (result: PostResponseDTO) => {
                return {
                    posts: result.posts.map(postFromApiResult),
                    pagination: result.pagination
                }
            },
        }
    );
}

const REPORT_POST_QUERY_KEY = ["posts", "report"] as const;

export interface ReportPostMutationVariables {
    id: string;
}

export function useReportPostMutation(
    opts?: UseMutationOptions<void, Error, ReportPostMutationVariables>
): UseMutationResult<void, Error, ReportPostMutationVariables> {
    const apiRequest = useApiRequest();
    const queryClient = useQueryClient();
    return useMutation({
        ...opts,
        mutationFn: async (variables) => {
            await apiRequest<void>("/posts/report", {
                method: "POST",
                body: variables,
            });
        },
        mutationKey: ["posts", "report"],
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries(REPORT_POST_QUERY_KEY);
            opts?.onSuccess?.(data, variables, context);
        }
    })
}


const REPORT_DMS_POST_QUERY_KEY = ["posts", "report-unable-to-contact"] as const;

export interface ReportBrokenDMsPostMutationVariables {
    id: string;
}

export function useReportBrokenDMsPostMutation(
    opts?: UseMutationOptions<void, Error, ReportBrokenDMsPostMutationVariables>
): UseMutationResult<void, Error, ReportBrokenDMsPostMutationVariables> {
    const apiRequest = useApiRequest();
    const queryClient = useQueryClient();
    return useMutation({
        ...opts,
        mutationFn: async (variables) => {
            await apiRequest<void>("/posts/report-unable-to-contact", {
                method: "POST",
                body: variables,
            });
        },
        mutationKey: ["posts", "report-unable-to-contact"],
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries(REPORT_DMS_POST_QUERY_KEY);
            opts?.onSuccess?.(data, variables, context);
        }
    })
}

const FAVOURITE_POST_QUERY_KEY = ["posts", "favourite"] as const;

export interface FavouritePostMutationVariables {
    postId: string;
    isFavourite?: boolean;
}

export function useFavouritePostMutation(
    opts?: UseMutationOptions<Post, Error, FavouritePostMutationVariables>
): UseMutationResult<Post, Error, FavouritePostMutationVariables> {
    const apiRequest = useApiRequest();
    const queryClient = useQueryClient();
    return useMutation({
        ...opts,
        mutationFn: async (variables) => {
            // If post is already favourited, use DELETE to remove Favourite status
            const method = variables.isFavourite ? "POST" : "DELETE";
            delete variables.isFavourite; // Don't submit this field, it's only used in the UI

            const result = await apiRequest<PostDTO>("/favourites", {
                method: method,
                body: variables,
            });

            return postFromApiResult(result);
        },
        mutationKey: ["posts", "favourite"],
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries(FAVOURITE_POST_QUERY_KEY);
            opts?.onSuccess?.(data, variables, context);
        },
    });
}
