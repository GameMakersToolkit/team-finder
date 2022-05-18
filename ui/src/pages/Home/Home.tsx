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
import { AvailabilitySelector } from "../AvailabilitySelector";
import { isAvailability } from "../../model/availability";
import { Onboarding } from "./components/Onboarding";
import { useEffect, useState } from "react";
import { ViewOptions } from "./components/ViewOptions";
import { isLanguage } from "../../model/language";
import { LanguageSelector } from "../LanguageSelector";
import { TimezoneOffsetSelector } from "../../components/TimezoneOffsetSelector";
import { allTimezoneOffsets, timezoneOffsetInfoMap } from "../../model/timezone";

export const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const updateSearchParam = useUpdateSearchParam(searchParams, setSearchParams);

  const [showSkillText, setShowSkillText] = useState(true)
  const [showAdvancedSearchOptions, setShowAdvancedSearchOptions] = useState(false)

  const [usingCustomTimezones, setUsingCustomTimezones] = useState(false);
  // Use ints in the URL from start to finish
  const [timezoneOffsetStart, setTimezoneOffsetStart] = useState(timezoneOffsetInfoMap[allTimezoneOffsets[0]].value)
  const [timezoneOffsetEnd, setTimezoneOffsetEnd] = useState(timezoneOffsetInfoMap[allTimezoneOffsets[24]].value)
  useEffect(() => {
    // Ordering is taken care of on the API side
    updateSearchParam("timezones", `${timezoneOffsetStart}/${timezoneOffsetEnd}`)
  }, [timezoneOffsetStart, timezoneOffsetEnd])

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
  const languagesFilter = searchParams.get("languages")?.split(",").filter(isLanguage);
  const toolsFilter = searchParams.get("tools")?.split(",").filter(isTool);
  const availabilityFilter = searchParams.get("availability")?.split(",").filter(isAvailability);

  const searchOptions: SearchOptions = {
    description: searchParams.get("description") || undefined,
    skillsPossessed: skillsPossessedFilter,
    skillsSought: skillsSoughtFilter,
    languages: languagesFilter,
    tools: toolsFilter,
    availability: availabilityFilter,
    timezones: searchParams.get("timezones") || undefined,
  };

  const query = usePostsList(searchOptions);

  return (
    <div className="container mx-auto max-w-screen-xxl p-1">
      <Onboarding />

      <div>
        <label className="font-bold block" htmlFor="descriptionFilter">
          Description
        </label>
        <input
          id="descriptionFilter"
          type="text"
          className="bg-transparent border-2 border-white text-white p-2 w-full h-[36px]"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
      </div>
      {/* The labels here seem back-to-front because 'sought'/'possessed' are from the perspective of the team */}
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
        <div className="mt-2">
          <label className="font-bold block" htmlFor="skillsPossessedFilter">
            I need:
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
            I can do:
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
      </div>


      <button
        onClick={() => setShowAdvancedSearchOptions(!showAdvancedSearchOptions)}
        className={`rounded border text-white p-2 mt-4 mr-2 mb-2 w-full sm:w-fit ${showAdvancedSearchOptions ? "bg-primary" : "bg-lightbg"}`}
      >
        Advanced Search Options:
      </button>
      {showAdvancedSearchOptions && (
        <>
          <div className="mt-2 lg:w-1/2">
            <label className="font-bold block" htmlFor="toolsFilter">
              Preferred Engine(s):
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
          <div className="mt-2 lg:w-1/2">
            <label className="font-bold block" htmlFor="toolsFilter">
              Language(s):
            </label>
            <LanguageSelector
              id="languagesFilter"
              value={languagesFilter ?? []}
              onChange={(newList) => {
                updateSearchParam(
                  "languages",
                  newList.length ? newList.join(",") : null
                );
              }}
            />
          </div>
          <div className="mt-4">
            <button
              onClick={() => setUsingCustomTimezones(!usingCustomTimezones)}
              className={`rounded border text-white p-2 mr-2 mb-2 w-full sm:w-fit ${usingCustomTimezones ? "bg-lightbg" : "bg-primary"}`}
            >
              All Timezones
            </button>

            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
              <div className={`${usingCustomTimezones ? "cursor-pointer" : "cursor-not-allowed"}`}>
                <label className={`font-bold block ${usingCustomTimezones ? "text-white" : "text-gray-400"}`} htmlFor="timezoneStart">
                  Earliest Timezone:
                </label>
                <TimezoneOffsetSelector
                  id="timezoneStart"
                  disabled={!usingCustomTimezones}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore Suppress weird-but-working Number <-> TimezoneOffset jank
                  value={timezoneOffsetStart}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore Suppress weird-but-working Number <-> TimezoneOffset jank
                  onChange={(timezoneOffsetStart) => setTimezoneOffsetStart(timezoneOffsetStart)}
                />
              </div>
              <div className={`${usingCustomTimezones ? "cursor-pointer" : "cursor-not-allowed"}`}>
                <label className={`font-bold block ${usingCustomTimezones ? "text-white" : "text-gray-400"}`} htmlFor="timezoneEnd">
                  Latest Timezone:
                </label>
                <TimezoneOffsetSelector
                  id="timezoneEnd"
                  disabled={!usingCustomTimezones}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore Suppress weird-but-working Number <-> TimezoneOffset jank
                  value={timezoneOffsetEnd}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore Suppress weird-but-working Number <-> TimezoneOffset jank
                  onChange={(timezoneOffsetEnd) => setTimezoneOffsetEnd(timezoneOffsetEnd)}
                />
              </div>
            </div>
          </div>
          <span className="text-xs">
            Leave blank to search all timezones.
          </span>
          <div className="mt-2">
            <label className="font-bold block" htmlFor="toolsFilter">
              Availability (select all that apply):
            </label>
            <AvailabilitySelector
              id="availabilityFilter"
              value={availabilityFilter ?? []}
              allowMultiple={true}
              onChange={(newList) => {
                updateSearchParam(
                  "availability",
                  newList.length ? newList.join(",") : null
                );
              }}/>
          </div>

          <ViewOptions showSkillText={showSkillText} setShowSkillText={setShowSkillText}/>
        </>
      )}

      {query.data && (
        <div className="mt-4">{query.data.length} results found</div>
      )}

      <div className="grid gap-2 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{}}>
        {query.data?.map((post) => (
          <PostPreview key={post.id} post={post} className="" showSkillText={showSkillText}/>
        ))}
      </div>

      {/* <pre>{JSON.stringify(query.data, null, 2)}</pre> */}
    </div>
  );
};
