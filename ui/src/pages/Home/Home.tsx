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
import { allTimezoneOffsets, TimezoneOffset, timezoneOffsetToInt } from "../../model/timezone";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useAuth } from "../../utils/AuthContext";
import { useUserInfo } from "../../queries/userInfo";
import { toast } from "react-hot-toast";
import { SortingOptions } from "./components/SortingOptions";
import { allSortOrders, SortOrder } from "../../model/sortOrder";
import { allSortBy, SortBy } from "../../model/sortBy";

export const Home: React.FC = () => {
  const auth = useAuth();
  const userInfo = useUserInfo();
  const isLoggedIn = auth && userInfo.data

  const [searchParams, setSearchParams] = useSearchParams();
  const updateSearchParam = useUpdateSearchParam(searchParams, setSearchParams);

  const [showSkillText, setShowSkillText] = useState(true)
  const [shouldLimitToFavourites, setShouldLimitToFavourites] = useState(false)
  const [showAdvancedSearchOptions, setShowAdvancedSearchOptions] = useState(false)

  const [usingCustomTimezones, setUsingCustomTimezones] = useState(false);
  // Use ints in the URL from start to finish
  const [timezoneOffsetStart, setTimezoneOffsetStart] = useState<TimezoneOffset[]>([allTimezoneOffsets[0]])
  const [previousTimezoneOffsetStart, setPreviousTimezoneOffsetStart] = useState<TimezoneOffset[]>()
  const [timezoneOffsetEnd, setTimezoneOffsetEnd] = useState<TimezoneOffset[]>([allTimezoneOffsets[24]])
  const [previousTimezoneOffsetEnd, setPreviousTimezoneOffsetEnd] = useState<TimezoneOffset[]>()
  useEffect(() => {
    // If a timezone selector is empty (user has removed value but not replaced it), don't try to update query
    if (timezoneOffsetStart.length === 0 || timezoneOffsetEnd.length === 0) {
      return;
    }

    // If user has added multiple timezones, stop them doing it! Take the new value and remove old value
    if (timezoneOffsetStart.length > 1) {
      setTimezoneOffsetStart(timezoneOffsetStart.filter(x => !(previousTimezoneOffsetStart || []).includes(x)))
    }
    if (timezoneOffsetEnd.length > 1) {
      setTimezoneOffsetEnd(timezoneOffsetEnd.filter(x => !(previousTimezoneOffsetEnd || []).includes(x)))
    }

    // We're only supporting one timezone here (at position [0]) regardless of what the user enters
    updateSearchParam("timezones", usingCustomTimezones
        ? `${timezoneOffsetToInt(timezoneOffsetStart[0])}/${timezoneOffsetToInt(timezoneOffsetEnd[0])}`
        : null // If usingCustomTimezones==false, search for all timezones without updating the last values in form
    )

    setPreviousTimezoneOffsetStart(timezoneOffsetStart)
    setPreviousTimezoneOffsetEnd(timezoneOffsetEnd)
  }, [timezoneOffsetStart, timezoneOffsetEnd, usingCustomTimezones])

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
  const sortOrderFilter = (searchParams.get("sortDir") || "desc") as SortOrder;
  const sortByFilter = (searchParams.get("sortBy") || "createdAt") as SortBy;

  const searchOptions: SearchOptions = {
    limitToFavourites: shouldLimitToFavourites,
    description: searchParams.get("description") || undefined,
    skillsPossessed: skillsPossessedFilter,
    skillsSought: skillsSoughtFilter,
    languages: languagesFilter,
    tools: toolsFilter,
    availability: availabilityFilter,
    timezones: searchParams.get("timezones") || undefined,
    sortDir: sortOrderFilter,
    sortBy: sortByFilter,
  };

  const query = usePostsList(searchOptions);

  return (
    <div className="container mx-auto max-w-screen-xxl p-1 px-4">
      <Onboarding />

      <h1 className="text-3xl my-4">Search for a post</h1>

      <div>
        <label className="font-bold block" htmlFor="descriptionFilter">
          Description
        </label>
        <input
          id="descriptionFilter"
          type="text"
          className="bg-black border-2 border-white text-white p-2 w-full h-[36px]"
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
        className={`rounded border text-white p-2 mt-4 mr-2 mb-2 w-full sm:w-fit hover:bg-primary-highlight ${showAdvancedSearchOptions ? "bg-primary" : "bg-lightbg"}`}
      >
        Advanced Search Options
      </button>

      <button
        onClick={() => {
          if (!isLoggedIn) {
            toast("You must be logged in view your favourite posts", {
              icon: "🔒",
              id: "favourite-post-view-info",
            });
            return;
          }

          setShouldLimitToFavourites(!shouldLimitToFavourites)
        }}
        className={`rounded border text-white p-2 mt-4 mr-2 mb-2 w-full sm:w-fit hover:bg-primary-highlight ${shouldLimitToFavourites ? "bg-primary" : "bg-lightbg"} ${!isLoggedIn && "cursor-not-allowed"}`}
      >
        Only Show Favourites
      </button>

      <button
        onClick={() => setSearchParams({})}
        className={`rounded border text-white p-2 mt-4 mr-2 mb-2 w-full sm:w-fit hover:bg-primary-highlight bg-lightbg`}
      >
        Clear Search
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
            <span className="mb-2 block sm:inline md:inline lg:inline">
              <input
                id="use-all-timezones-checkbox"
                type="checkbox"
                onChange={() => setUsingCustomTimezones(!usingCustomTimezones)}
                checked={!usingCustomTimezones}
                className={`mr-2`}
              />
              <label
                className="w-full"
                htmlFor="use-all-timezones-checkbox"
              >
                  Search All Timezones
              </label>
            </span>

            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
              <div className={`${usingCustomTimezones ? "cursor-pointer" : "cursor-not-allowed"}`}>
                <label className={`font-bold block ${usingCustomTimezones ? "text-white" : "text-gray-400"}`} htmlFor="timezoneStart">
                  Earliest Timezone:
                </label>
                <TimezoneOffsetSelector
                  id="timezoneStart"
                  disabled={!usingCustomTimezones}
                  value={usingCustomTimezones ? timezoneOffsetStart : []}
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
                  value={usingCustomTimezones ? timezoneOffsetEnd : []}
                  onChange={(timezoneOffsetEnd) => setTimezoneOffsetEnd(timezoneOffsetEnd)}
                />
              </div>
            </div>
          </div>
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

      <SortingOptions
        sortByValue={sortByFilter ?? allSortBy[3]}
        sortByOnChange={(newSortOrder) => updateSearchParam("sortBy", newSortOrder)}
        sortOrderValue={sortOrderFilter ?? allSortOrders[1]}
        sortOrderOnChange={(newSortOrder) => updateSearchParam("sortDir", newSortOrder)}
      />

      <div className="block">
        <h2 className="text-3xl my-4 mr-2 inline-block">Search results</h2>
        <span className="inline-block">({query?.isLoading ? `Loading, please wait...` : `${query?.data?.length || 0} posts found`})</span>
      </div>

      {query.isLoading && (<LoadingSpinner />)}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{minHeight: "50vh"}}>
        {query.data?.map((post) => (
          <PostPreview key={post.id} post={post} className="" showSkillText={showSkillText}/>
        ))}
      </div>

      {/* <pre>{JSON.stringify(query.data, null, 2)}</pre> */}
    </div>
  );
};
