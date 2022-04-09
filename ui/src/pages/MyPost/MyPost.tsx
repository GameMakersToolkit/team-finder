import * as React from "react";
import { useMyPostQuery } from "../../queries/my-post";
import { useEnsureLoggedIn } from "../../utils/useEnsureLoggedIn";

export const MyPost: React.FC = () => {
  const userInfoQuery = useEnsureLoggedIn();

  const myPostQuery = useMyPostQuery();

  return <pre>{JSON.stringify(myPostQuery.data)}</pre>;
};
