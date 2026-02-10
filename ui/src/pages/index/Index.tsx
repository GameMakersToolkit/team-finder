import * as React from "react";
import { useJams } from "../../api/jam.ts";
import { Jam } from "../../common/models/jam.ts";

export const Index: React.FC = () => {

    const { data: jams } = useJams()

    return (
        <main>
            <h1 className="text-center text-4xl mt-16 mb-8">
                <span className="block mono-header">FIND</span>
                <span className="block mono-header">YOUR</span>
                <span className="block mono-header">JAM.</span>
                <span className="block mono-header">TEAM</span>
            </h1>

            <h2 className="text-center text-2xl mb-8">
              The easiest way to find your next game jam partners
            </h2>

            {jams !== undefined ? (<JamInfo jams={jams!!} />) : <p className="text-center">Loading...</p>}
        </main>
    )
}

const JamInfo: React.FC<{jams: Jam[]}> = ({jams}) => {

  const exampleJam = jams.find(jam => jam.jamId == "example-jam")!!
  const now = Date.now()
  const notStartedJams = jams
    .filter(jam => Date.parse(jam.start) < now)
    .filter(jam => jam.jamId !== exampleJam.jamId)
  const startedJams = jams
    .filter(jam => Date.parse(jam.start) >= now)
    .filter(jam => jam.jamId !== exampleJam.jamId)

  return (
    <>
      <h3 className="mono-header text-[#ea2155] drop-shadow-[0_1.4px_1.4px_rgba(0,0,0,0.8)] text-center text-2xl font-bold mb-4">Active Jams</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-8 md:gap-16 lg:gap-16">
          {startedJams.map(jam => <JamTile jam={jam} />)}
      </div>

      <h3 className="mono-header text-[#ea2155] drop-shadow-[0_1.4px_1.4px_rgba(0,0,0,0.8)] text-center text-2xl font-bold mb-4">Starting Soon</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-8 md:gap-16 lg:gap-16">
          {notStartedJams.map(jam => <JamTile jam={jam} />)}
      </div>


      <h3 className="mono-header text-[#ea2155] drop-shadow-[0_1.4px_1.4px_rgba(0,0,0,0.8)] text-center text-2xl font-bold mb-4">Not sure?</h3>
      <h4 className="text-center">Check out the example page to see how this site works</h4>
      <div className="flex flex-row justify-center">
        <ExampleJamTile jam={exampleJam} />
      </div>
    </>
    )
}

const JamTile: React.FC<{jam: Jam}> = ({ jam }) => {
    const start = new Date(Date.parse(jam.start))
    const daysInFuture = Math.ceil(Math.abs(start.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return (
        <a href={jam.jamId} className="mb-4">
            <section
              className={`h-full bg-[${jam.styles["--gradient-end"]}] border-neutral-900 rounded-xl p-4 flex flex-col justify-evenly`}
              style={{
                backgroundImage: `linear-gradient(${jam.styles["--gradient-start"]}, ${jam.styles["--gradient-end"]})`
              }}
            >
                <img src={jam.logoStackedUrl} alt={jam.name} className="mx-auto mb-8 h-[128px] bg-gray-700" />
                <h2 className="text-xl font-bold text-center mb-2 whitespace-break-spaces">{jam.name}</h2>
                <p className="text-xs">Starts in {daysInFuture} days</p>
            </section>
        </a>
    )
}

const ExampleJamTile: React.FC<{jam: Jam}> = ({ jam }) => {
    return (
        <a href={jam.jamId} className="mb-4">
          <section
            className={`h-full bg-[${jam.styles["--gradient-end"]}] border-neutral-900 rounded-xl p-4 flex flex-col justify-evenly`}
            style={{
              backgroundImage: `linear-gradient(${jam.styles["--gradient-start"]}, ${jam.styles["--gradient-end"]})`
            }}
          >
                <img src={jam.logoStackedUrl} alt={jam.name} className="mx-auto mb-8 h-[128px] bg-gray-700" />
                <h2 className="text-xl font-bold text-center mb-2 whitespace-break-spaces">{jam.name}</h2>
            </section>
        </a>
    )
}
