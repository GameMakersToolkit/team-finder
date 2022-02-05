import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { usePostsList } from "../../queries/posts";
import { useUpdateSearchParam } from "../../utils/searchParam";
import { useThrottleState } from "../../utils/throttleState";

export const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const updateSearchParam = useUpdateSearchParam(searchParams, setSearchParams);

  const [description, setDescription] = useThrottleState(
    searchParams.get("description") ?? "",
    React.useCallback(
      (value) => updateSearchParam("description", value, { replace: true }),
      [updateSearchParam]
    ),
    {
      immediatelyUpdateIfFalsey: true,
    }
  );

  const searchOptions = {
    description: searchParams.get("description") || undefined,
  };

  const query = usePostsList(searchOptions);

  return (
    <div>
      <div>
        <label htmlFor="descriptionFilter">Description</label>
        <input
          id="descriptionFilter"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
      </div>
      <pre>{JSON.stringify(query.data, null, 2)}</pre>
    </div>
  );
};
