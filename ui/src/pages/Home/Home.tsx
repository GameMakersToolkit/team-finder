import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { usePostsList } from "../../queries/posts";

export const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const updateSearchParam = (
    key: string,
    value: string | null,
    options?: Parameters<typeof setSearchParams>[1]
  ) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value == null) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, value);
    }
    setSearchParams(newSearchParams.toString(), options);
  };

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
          value={searchParams.get("description") ?? ""}
          onChange={(e) =>
            updateSearchParam("description", e.currentTarget.value || null, {
              replace: true,
            })
          }
        />
      </div>
      <pre>{JSON.stringify(query.data, null, 2)}</pre>
    </div>
  );
};
