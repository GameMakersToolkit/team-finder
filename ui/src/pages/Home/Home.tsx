import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { allSkills, isSkill } from "../../model/skill";
import { SearchOptions, usePostsList } from "../../queries/posts";
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
      <div>
        Find posts offering skills:
        {allSkills.map((skill) => {
          return (
            <label key={skill}>
              <input
                type="checkbox"
                checked={skillsPossessedFilter?.includes(skill) ?? false}
                onChange={(e) => {
                  let newList = skillsPossessedFilter ?? [];
                  if (e.currentTarget.checked && !newList.includes(skill)) {
                    newList = newList.concat([skill]);
                  } else if (!e.currentTarget.checked) {
                    newList = newList.filter((it) => it !== skill);
                  }
                  updateSearchParam(
                    "skillsPossessed",
                    newList.length ? newList.join(",") : null
                  );
                }}
              />
              {skill}
            </label>
          );
        })}
      </div>
      {query.data && <div>{query.data.length} results found</div>}
      <pre>{JSON.stringify(query.data, null, 2)}</pre>
    </div>
  );
};
