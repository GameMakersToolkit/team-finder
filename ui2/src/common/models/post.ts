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
  timezoneOffsets: number[];
  languages: string[];
  isFavourite: boolean;
  reportCount: number;
  unableToContactCount: number;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export type PostApiResult = Omit<Post, "createdAt" | "updatedAt" | "deletedAt"> & {
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

export function postFromApiResult(input: PostApiResult): Post {
  return {
    ...input,
    createdAt: new Date(input.createdAt),
    updatedAt: transformDateOrNull(input.updatedAt),
    deletedAt: transformDateOrNull(input.deletedAt),
  };
}

// this can be moved to a util if it keeps coming up
function transformDateOrNull(input: string | null): Date | null {
  if (input === null) {
    return null;
  }
  return new Date(input);
}

