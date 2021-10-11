import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { PageHeader } from "../../components/PageHeader";
import { TeamData, Team } from "../../components/Team";
import { SkillsetSelector } from "../../components/SkillsetSelector";
import { ReactSVG } from "react-svg";
import { MultiSelect } from "../../components/MultiSelect";
import { languageSelectIndex } from "../../components/LanguageSelector";
import { importMeta } from "../../utils/importMeta";

const getTeamsList = (
  queryParams: {
    order: "asc" | "desc" | "random";
    query: string;
    languages: string;
    skillsetMask: number;
    page: number;
  }
): Promise<Array<Record<string, unknown>>> => {
  const url = new URL(`${importMeta().env.VITE_API_URL}/teams`);

  for(const [k, v] of Object.entries(queryParams)) url.searchParams.append(k, v.toString());

  return fetch(url.toString(), { mode: "cors" }).then((res) => res.json());
};

const pageSize = 25;

export const Home: React.FC = () => {
  return (<>
    <div className="text-center text-3xl text-primary font-light my-12">
    Looking for a team to do the jam with?<br></br>
    Check the list below to find one to join!
    </div>
    <div className="text-center text-3xl font-light mb-20">
      Make sure you&apos;re in the <a className="underline" href="https://discord.gg/pd4rQKU">GMTK Discord</a> so that you can message people!
    </div>
    <TeamList/>
  </>);
};

type orderVals = "desc" | "asc" | "random";

const TeamList: React.FC = () => {
  const [selectedSkillsets, setSelectedSkillsets] = useState<number[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [order, updateOrder] = useState<orderVals>("desc");
  const [query, updateQuery] = useState<string>("");

  const querySearchTimeout = React.useRef<number | undefined>(undefined);
  const tryUpdateQuery = (query: string) => {
    clearTimeout(querySearchTimeout.current);

    querySearchTimeout.current = setTimeout(() => updateQuery(query), 250) // 250ms
  }

  const skillsetMask = selectedSkillsets.reduce((a, b) => a + b, 0);
  const languages = selectedLanguages.join(",");

  const {
    isLoading: initalLoad,
    isFetchingNextPage, isError, data, fetchNextPage
  } = useInfiniteQuery(["Teams", skillsetMask, order, languages, query],
    async ({pageParam: page = 1}) => 
      ( await getTeamsList({ skillsetMask, order, query, languages, page }) ).map((t) => new TeamData(t)),
    {
      getNextPageParam: (lastPage, allPages) => lastPage.length < pageSize ? undefined : allPages.length + 1
    }
  );

  const pagesArray = data ? data.pages : [] as TeamData[][];
  const isLoading = initalLoad || isFetchingNextPage;

  const lastPage = pagesArray[pagesArray.length - 1] || [];
  const allLoaded = lastPage.length < pageSize;

  useEffect(() => {
    if(allLoaded) return;

    const docEle = document.documentElement;

    let hasFetchedNext = false;
    const onScroll = () => {
      const distanceLeft = docEle.scrollHeight - (docEle.scrollTop + innerHeight);
      if((distanceLeft < 200) && !hasFetchedNext) {
        hasFetchedNext = true;
        fetchNextPage();
      }
    }

    const listenTo = [window, docEle];

    listenTo.forEach(x =>
      x.addEventListener("scroll", onScroll, {passive: true})
    );

    return () => listenTo.forEach(x =>
      x.removeEventListener("scroll", onScroll)
    );
  }, [fetchNextPage, allLoaded, pagesArray]);

  return (
    // scrollbar popping in and out on load causes some jank
    // setting min-height to be 100% of the view height prevents this
    <div style={{minHeight:"100vh"}}>
      <PageHeader>
        Filter by what skills you can offer:
      </PageHeader>
      <SkillsetSelector
        selectedSkillsets={selectedSkillsets}
        onChange={setSelectedSkillsets}
      />

      <div className="flex flex-row mt-6">

        <div className="mr-12">
          <label className="text-lg">
            Sort by:
            <select
              value={order}
              onChange={e => updateOrder(e.target.value as orderVals)}
              className="text-black block p-1 py-2 mt-1 outline-none leading-loose"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
              <option value="random">Random</option>
            </select>
          </label>
        </div>

        <label className="text-lg">
          Search keywords description:<br />
          <input
            type="text"
            className="w-full text-black block p-1 pb-0 mt-1 outline-none leading-loose"
            onChange={e => tryUpdateQuery(e.target.value)}
          />
        </label>

      </div>

      <div className="mt-4">
        <div className="text-lg mb-1">
          Filter by language(s):
        </div>
        <MultiSelect
          placeholder="Click here to add languages..."
          disabled={isLoading}
          selected={selectedLanguages}
          changeCallback={setSelectedLanguages}
          valueDisplayIndex={languageSelectIndex}
        />
      </div>


      <div className="pt-14"></div>

      <div>{isError ?
        "Sorry, something went wrong. Please try again in a few minutes." :
        pagesArray.map(arr =>
          arr.map((t) => <Team key={t.id} team={t} />)
        )
      }</div>
      
      {isLoading ?
        <ReactSVG className="w-40 m-auto block" src="/spinner.svg"/>
      : null}

      {allLoaded ?
        <div className="text-center text-2xl pb-10">No more teams to load</div>
      : null}
    </div>
  );
};
