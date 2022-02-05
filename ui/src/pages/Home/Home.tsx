import * as React from "react";
import { usePostsList } from "../../queries/posts";

export const Home: React.FC = () => {
  const query = usePostsList();

  return <pre>{JSON.stringify(query.data, null, 2)}</pre>;
};
