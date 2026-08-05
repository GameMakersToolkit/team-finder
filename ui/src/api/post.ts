import {
    UseMutationOptions,
    UseMutationResult,
    useQuery,
    UseQueryResult
} from '@tanstack/react-query';
import {useApiRequest} from "./apiRequest.ts";
import {Post, PostResponseDTO, postFromApiResult, PostResponse, PostDTO} from '../common/models/post.ts';
import { getJamId } from "../common/utils/getJamId.ts";
import { useMutationWithInvalidation } from "./mutationFactory.ts";

export function usePosts(searchParams: URLSearchParams): UseQueryResult<PostResponse, Error> {
    const apiRequest = useApiRequest();

    const isOnlyBookmarked = searchParams.get('bookmarked') === "true"
    const path = isOnlyBookmarked ? "posts/favourites" : "posts"
    const url = `/${path}?${searchParams}&jamId=${getJamId()}`

    return useQuery({
        queryKey: ["posts", path, Object.fromEntries(searchParams)],
        queryFn: () => {
            return apiRequest<PostResponseDTO>(url, {method: "GET"});
        },
        ...{
            select: (result: PostResponseDTO) => {
                return {
                    posts: result.posts.map(postFromApiResult),
                    pagination: result.pagination
                }
            },
        }
    });
}

const REPORT_POST_QUERY_KEY = ["posts", "report"] as const;

export interface ReportPostMutationVariables {
    id: string;
}

export function useReportPostMutation(
    opts?: UseMutationOptions<void, Error, ReportPostMutationVariables>
): UseMutationResult<void, Error, ReportPostMutationVariables> {
    const apiRequest = useApiRequest();
    return useMutationWithInvalidation({
        opts,
        mutationKey: ["posts", "report"],
        invalidateKey: REPORT_POST_QUERY_KEY,
        mutationFn: async (variables) => {
            await apiRequest<void>("/posts/report", {
                method: "POST",
                body: variables,
            });
        },
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
    return useMutationWithInvalidation({
        opts,
        mutationKey: ["posts", "report-unable-to-contact"],
        invalidateKey: REPORT_DMS_POST_QUERY_KEY,
        mutationFn: async (variables) => {
            await apiRequest<void>("/posts/report-unable-to-contact", {
                method: "POST",
                body: variables,
            });
        },
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
    return useMutationWithInvalidation({
        opts,
        mutationKey: ["posts", "favourite"],
        invalidateKey: FAVOURITE_POST_QUERY_KEY,
        mutationFn: async (variables) => {
            // If post is already favourited, use DELETE to remove Favourite status
            const method = variables.isFavourite ? "POST" : "DELETE";
            const requestPayload = {
                postId: variables.postId,
            };

            const result = await apiRequest<PostDTO>("/favourites", {
                method: method,
                body: requestPayload,
            });

            return postFromApiResult(result);
        },
    });
}
