import * as React from "react";
import { useQuery } from "react-query";
import { importMetaEnv } from "../../utils/importMeta";

interface Post {
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
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

export const Home: React.FC = () => {
  const query = useQuery(["posts"], async () => {
    const url = `${importMetaEnv().VITE_API_URL}/posts`;
    const response = await fetch(url);
    if (response.ok) {
      return (await response.json()) as Post[];
    } else {
      throw new Error(await response.text());
    }
  });

  return <pre>{JSON.stringify(query.data, null, 2)}</pre>;
};
