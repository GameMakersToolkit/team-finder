import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { PostPreview } from "../../components/PostPreview";
import { isSkill } from "../../model/skill";
import { SearchOptions, usePostsList } from "../../queries/posts";
import { useUpdateSearchParam } from "../../utils/searchParam";
import { useThrottleState } from "../../utils/throttleState";
import { SkillSelector } from "../SkillSelector";
import { ToolSelector } from "../ToolSelector";
import { isTool } from "../../model/tool";

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

  const skillsPossessedFilter = searchParams.get("skillsPossessed")?.split(",").filter(isSkill);
  const skillsSoughtFilter = searchParams.get("skillsSought")?.split(",").filter(isSkill);
  const toolsFilter = searchParams.get("tools")?.split(",").filter(isTool);

  const searchOptions: SearchOptions = {
    description: searchParams.get("description") || undefined,
    skillsPossessed: skillsPossessedFilter,
    skillsSought: skillsSoughtFilter,
    tools: toolsFilter
  };

  const query = usePostsList(searchOptions);

  return (
    <div className="container mx-auto max-w-screen-xxl p-1">
      <div>
        <label className="font-bold block" htmlFor="descriptionFilter">
          Description
        </label>
        <input
          id="descriptionFilter"
          type="text"
          className="bg-transparent border-2 border-white text-white px-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
      </div>
      <div className="mt-2">
        <label className="font-bold block" htmlFor="skillsPossessedFilter">
          I can do:
        </label>
        <SkillSelector
          id="skillsPossessedFilter"
          value={skillsPossessedFilter ?? []}
          onChange={(newList) => {
            updateSearchParam(
              "skillsPossessed",
              newList.length ? newList.join(",") : null
            );
          }}
        />
      </div>
      <div className="mt-2">
        <label className="font-bold block" htmlFor="skillsSoughtFilter">
          I need:
        </label>
        <SkillSelector
          id="skillsSoughtFilter"
          value={skillsSoughtFilter ?? []}
          onChange={(newList) => {
            updateSearchParam(
              "skillsSought",
              newList.length ? newList.join(",") : null
            );
          }}
        />
      </div>
      <div className="mt-2">
        <label className="font-bold block" htmlFor="toolsFilter">
          Tools used:
        </label>
        <ToolSelector
          id="toolsFilter"
          value={toolsFilter ?? []}
          onChange={(newList) => {
            updateSearchParam(
              "tools",
              newList.length ? newList.join(",") : null
            );
          }}
        />
      </div>
      {query.data && (
        <div className="mt-4">{query.data.length} results found</div>
      )}
      {query.data?.map((post) => (
        <PostPreview key={post.id} post={post} className="mt-4" />
      ))}
      {/* <pre>{JSON.stringify(query.data, null, 2)}</pre> */}
    </div>
  );
};
