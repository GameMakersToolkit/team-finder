import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { importMetaEnv } from "../utils/importMeta";

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

type GetPost = Omit<Post, "createdAt" | "updatedAt" | "deletedAt"> & {
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

function transformDateOrNull(input: string | null): Date | null {
  if (input === null) {
    return null;
  }
  return new Date(input);
}

export function usePosts(
  queryOptions?: UseQueryOptions<GetPost[], Error, Post[], ["posts"]>
): UseQueryResult<Post[], Error> {
  return useQuery(
    ["posts"],
    async () => {
      const url = `${importMetaEnv().VITE_API_URL}/posts`;
      const response = await fetch(url);
      if (response.ok) {
        return (await response.json()) as GetPost[];
      } else {
        throw new Error(await response.text());
      }
    },
    {
      ...queryOptions,
      select: (posts: GetPost[]) =>
        posts.map((post) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: transformDateOrNull(post.updatedAt),
          deletedAt: transformDateOrNull(post.deletedAt),
        })),
    }
  );
}
