import { Skill } from "./skill";
import { Availability } from "./availability";
import { Tool } from "./tool";
import { Language } from "./language";
import { TimezoneOffset } from "./timezone";

export interface Post {
  id: string;
  author: string;
  authorId: string;
  description: string;
  size: number;
  skillsPossessed: Skill[];
  skillsSought: Skill[];
  preferredTools: Tool[];
  availability: Availability;
  // The UI uses TimezoneOffset[], the API (and mocks) use number[], and the TimezoneSelector does the magic conversion
  timezoneOffsets: TimezoneOffset[] | number[];
  languages: Language[];
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

// this can be moved to a util if it keeps coming up
function transformDateOrNull(input: string | null): Date | null {
  if (input === null) {
    return null;
  }
  return new Date(input);
}

export function postFromApiResult(input: PostApiResult): Post {
  return {
    ...input,
    createdAt: new Date(input.createdAt),
    updatedAt: transformDateOrNull(input.updatedAt),
    deletedAt: transformDateOrNull(input.deletedAt),
  };
}
