import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { PostPreview } from "../../components/PostPreview";
import { isSkill } from "../../model/skill";
import { SearchOptions, usePostsList } from "../../queries/posts";
import { useUpdateSearchParam } from "../../utils/searchParam";
import { useThrottleState } from "../../utils/throttleState";
import { SkillList } from "../SkillList";

export const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const updateSearchParam = useUpdateSearchParam(searchParams, setSearchParams);

  const [description, setDescription] = useThrottleState(
    searchParams.get("description") ?? "",
    React.useCallback(
      (value) =>
        updateSearchParam("description", value || null, { replace: true }),
      [updateSearchParam]
    ),
    {
      immediatelyUpdateIfFalsey: true,
    }
  );

  const skillsPossessedFilter = searchParams
    .get("skillsPossessed")
    ?.split(",")
    .filter(isSkill);

  const searchOptions: SearchOptions = {
    description: searchParams.get("description") || undefined,
    skillsPossessed: skillsPossessedFilter,
  };

  const query = usePostsList(searchOptions);

  return (
    <div className="container mx-auto max-w-screen-xxl p-1">
      <div>
        <label htmlFor="descriptionFilter">Description</label>
        <input
          id="descriptionFilter"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
      </div>
      <div>
        Find posts offering skills:
        <SkillList
          value={skillsPossessedFilter ?? []}
          onChange={(newList) => {
            updateSearchParam(
              "skillsPossessed",
              newList.length ? newList.join(",") : null
            );
          }}
        />
      </div>
      {query.data && <div>{query.data.length} results found</div>}
      {query.data?.map((post) => (
        <PostPreview key={post.id} post={post} className="mt-4" />
      ))}
      {/* <pre>{JSON.stringify(query.data, null, 2)}</pre> */}
    </div>
  );
};
