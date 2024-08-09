export interface Post {
  id: string;
  author: string;
  authorId: string;
  description: string;
  size: number;
  skillsPossessed: string[];
  skillsSought: string[];
  preferredTools: string[];
  availability: string;
  timezoneOffsets: string[];
  languages: string[];
  isFavourite: boolean;
  reportCount: number;
  unableToContactCount: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type PostDTO = Omit<Post, "createdAt" | "updatedAt" | "deletedAt"> & {
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type PostResponseDTO = {
  posts: PostDTO[];
  pagination: {current: number, total: number};
}

export type PostResponse = {
  posts: Post[];
  pagination: {current: number, total: number};
}

export function postFromApiResult(input: PostDTO): Post {
  return {
    ...input,
    createdAt: new Date(input.createdAt),
    updatedAt: transformDateOrNull(input.updatedAt),
    deletedAt: transformDateOrNull(input.deletedAt),
  };
}

// this can be moved to a util if it keeps coming up
function transformDateOrNull(input?: string): Date | undefined {
  if (!input) {
    return;
  }
  return new Date(input);
}

