import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { apiRequest } from "../utils/apiRequest";

export interface Post {
  id: number;
  author: string;
  authorId: string;
  description: string;
  skillsPossessed: string[]; // TODO: constants
  skillsSought: string[]; // TODO: constants
  availability: string; // TODO: constants
  timezoneStr: string;
  languages: string[]; // TODO: constants
  reportCount: number;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export type GetPost = Omit<Post, "createdAt" | "updatedAt" | "deletedAt"> & {
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

// this can be moved to a util if it keeps coming up
function transformDateOrNull(input: string | null): Date | null {
  if (input === null) {
    return null;
  }
  return new Date(input);
}

export function usePosts(
  queryOptions?: UseQueryOptions<GetPost[], Error, Post[], ["posts"]>
): UseQueryResult<Post[], Error> {
  return useQuery(["posts"], () => apiRequest<GetPost[]>("/posts"), {
    ...queryOptions,
    select: (posts: GetPost[]) =>
      posts.map((post) => ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: transformDateOrNull(post.updatedAt),
        deletedAt: transformDateOrNull(post.deletedAt),
      })),
  });
}
