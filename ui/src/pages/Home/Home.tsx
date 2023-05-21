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
import { SearchMode, SearchModeSelector } from "./components/SearchModeSelector";
import { importMetaEnv } from "../../utils/importMeta";
import { getCountdownComponents } from "../../utils/countdown";

export const Home: React.FC = () => {
  const auth = useAuth();
  const userInfo = useUserInfo();
  const isLoggedIn = auth && userInfo.data

  const [searchParams, setSearchParams] = useSearchParams();
  const updateSearchParam = useUpdateSearchParam(searchParams, setSearchParams);

  const [showSkillText, setShowSkillText] = useState(true)
  const [showAdvancedSearchOptions, setShowAdvancedSearchOptions] = useState(false)

  const [usingCustomTimezones, setUsingCustomTimezones] = useState(false);
  // Use ints in the URL from start to finish
  const [timezoneOffsetStart, setTimezoneOffsetStart] = useState<TimezoneOffset[]>([allTimezoneOffsets[0]])
  const [previousTimezoneOffsetStart, setPreviousTimezoneOffsetStart] = useState<TimezoneOffset[]>()
  const [timezoneOffsetEnd, setTimezoneOffsetEnd] = useState<TimezoneOffset[]>([allTimezoneOffsets[24]])
  const [previousTimezoneOffsetEnd, setPreviousTimezoneOffsetEnd] = useState<TimezoneOffset[]>()

  const [time, setTime] = useState(Date.now());

  const shouldLimitToFavourites = searchParams.get("favourites") || false;

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

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
  }, [timezoneOffsetStart, timezoneOffsetEnd, usingCustomTimezones, updateSearchParam, previousTimezoneOffsetStart, previousTimezoneOffsetEnd])

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

  // I know these aren't filters, just keeping the naming convention for now
  const sortOrderFilter = (searchParams.get("sortDir") || "desc") as SortOrder;
  const sortByFilter = (searchParams.get("sortBy") || "createdAt") as SortBy;
  const skillsPossessedSearchModeFilter = (searchParams.get("skillsPossessedSearchMode") || "and") as SearchMode;
  const skillsSoughtSearchModeFilter = (searchParams.get("skillsSoughtSearchMode") || "and") as SearchMode;

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
    skillsPossessedSearchMode: skillsPossessedSearchModeFilter,
    skillsSoughtSearchMode: skillsSoughtSearchModeFilter,
  };

  const jamName = importMetaEnv().VITE_JAM_NAME;
  const countdown = getCountdownComponents(time);
  const query = usePostsList(searchOptions);

  if (searchParams.get("error")) {
    toast("Sorry, something went wrong logging you in: " + searchParams.get("error_description"), {
      icon: "⛔",
      id: "auth-failure-reason",
    });

    // Delete all search params; there's extra OAuth2 guff in there because Ktor is a chore to work with
    setSearchParams([]);
  }

  return (
    <div className="container mx-auto max-w-screen-xxl p-1 px-4">

      <Onboarding />

      <div className="mb-8 sm:mb-8">
          <div className="inline-block w-full sm:w-1/2 pb-8">
            <img
              className="m-auto pt-16 px-16 pb-4"
              src="/logos/header.png"
              width={"70%"}
              alt={jamName + " Team Finder logo"}
            />
            <p className="text-center">{`Welcome to the ${jamName} Team Finder!`}</p>
            <p className="text-center">Create a post or search below to find a team.</p>
          </div>
          <div className="inline-block w-full sm:w-1/2 text-center">
            <div className="bg-red-600 border-red-600 border-2 rounded-xl inline-block p-3">
                <span className="text-4xl">{`${countdown.days.toString().padStart(2, '0')}: `}</span>
                <span className="text-4xl">{`${countdown.hours.toString().padStart(2, '0')}: `}</span>
                <span className="text-4xl">{`${countdown.minutes.toString().padStart(2, '0')} `}</span>
            </div>
            <p className="text-center py-3">
              <span className="mr-4 font-bold text-xl">Days</span>
              <span className="mr-4 font-bold text-xl">Hours</span>
              <span className=" font-bold text-xl">Minutes</span>
            </p>
            <p className="text-center">Left until the jam starts</p>
          </div>
      </div>

      <div className="rounded-xl bg-grey-500 py-4 px-2">

      <h1 className="text-xl my-2 font-bold text-center">Find people to jam with:</h1>

        <label className="font-bold block" htmlFor="descriptionFilter">
          Keywords
        </label>
        <input
          id="descriptionFilter"
          type="text"
          placeholder="Search for keywords in a post"
          className="input px-2 py-1 w-full h-[36px]"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
      {/* The labels here seem back-to-front because 'sought'/'possessed' are from the perspective of the team */}
      <div className="bg-grey-500 grid gap-2 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        <div className="mt-2">
          <label className="font-bold block" htmlFor="skillsPossessedFilter">
            I&apos;m looking for:
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

       <div className="text-center">
      {/*<button
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
      </button>*/}

      <button
        onClick={() => setSearchParams({})}
        className={`border rounded-xl text-white px-4 py-2 mt-4 mr-2 mb-2 w-full sm:w-fit`}
      >
        Clear Search
      </button>

      <button
        onClick={() => setShowAdvancedSearchOptions(!showAdvancedSearchOptions)}
        className={`border rounded-xl border-blue-200 text-blue-200 px-4 py-2 mt-4 mr-2 mb-2 w-full sm:w-fit`}
      >
        More options <span>{showAdvancedSearchOptions ? '⌄' : '⌃'}</span>
      </button>

      </div>

      {showAdvancedSearchOptions && (
        <>
          <div className="mb-2 grid gap-2 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-2">
            <div>
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
            <div>
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
          </div>
          <div className="mb-2 grid gap-2 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-4">
            <div>
              <label className="font-bold block" htmlFor="skillsPossessedSearchModeSelector">
                When searching for skills you need:
              </label>
              <SearchModeSelector
                id="skillsPossessedSearchModeSelector"
                value={skillsPossessedSearchModeFilter ?? "and"}
                onChange={(newSearchMode) => updateSearchParam("skillsPossessedSearchMode", newSearchMode)}
              />
            </div>
            <div>
              <label className="font-bold block" htmlFor="skillsSoughtSearchModeSelector">
                When searching for skills you have:
              </label>
              <SearchModeSelector
                id="skillsSoughtSearchModeSelector"
                value={skillsSoughtSearchModeFilter ?? "and"}
                onChange={(newSearchMode) => updateSearchParam("skillsSoughtSearchMode", newSearchMode)}
              />
            </div>
          </div>
          <div className="mb-2 mt-4">
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

            <div className="grid gap-2 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
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
          <div className="mb-2 mt-2">
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

            <ViewOptions showSkillText={showSkillText} setShowSkillText={setShowSkillText}/>
          </div>
        </>
      )}

      </div>

      <div className="block" style={{overflow: "auto"}}>
        <h2 className="text-3xl my-4 mr-2 inline-block">Search results</h2>

        <SortingOptions
          sortByValue={sortByFilter ?? allSortBy[3]}
          sortByOnChange={(newSortOrder) => updateSearchParam("sortBy", newSortOrder)}
          sortOrderValue={sortOrderFilter ?? allSortOrders[1]}
          sortOrderOnChange={(newSortOrder) => updateSearchParam("sortDir", newSortOrder)}
        />
      </div>

      {query.isLoading && (<LoadingSpinner />)}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{minHeight: "50vh"}}>
        {query.data?.map((post) => (
          <PostPreview key={post.id} post={post} className="" showSkillText={showSkillText}/>
        ))}
      </div>

      {/* <pre>{JSON.stringify(query.data, null, 2)}</pre> */}
    </div>
  );
};
