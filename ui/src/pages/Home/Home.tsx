import * as React from "react";
import { usePosts } from "../../queries/posts";

export const Home: React.FC = () => {
  const query = usePosts();

  return <pre>{JSON.stringify(query.data, null, 2)}</pre>;
};
