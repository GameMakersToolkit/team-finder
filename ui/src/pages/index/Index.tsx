import {useEffect, useState} from "react";
import * as React from "react";
import {Jam} from "../../common/components/JamSpecificStyling.tsx";

export const Index: React.FC = () => {

    const [jams, setJams] = useState([])
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/jams`)
            .then(res => res.json())
            .then(setJams)
    }, [])

    const featuredJams = jams.sort((a: Jam, b: Jam) => b.participants - a.participants).slice(0, 6)
    const newestJams = jams.sort((a: Jam, b: Jam) => Date.parse(a.start) - Date.parse(b.start)).slice(0, 6)

    return (
        <main>
            <h1 className="text-center text-4xl mt-16 mb-16">
                <span className="block mono-header">FIND</span>
                <span className="block mono-header">YOUR</span>
                <span className="block mono-header">JAM.</span>
                <span className="block mono-header">TEAM</span>
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-8 md:gap-16 lg:gap-16">
                <div>
                    <h3 className="mono-header text-[#ea2155] drop-shadow-[0_1.4px_1.4px_rgba(0,0,0,0.8)] text-center text-2xl font-bold mb-4">Featured</h3>
                    <h4>Our top picks and most popular communities</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                        {featuredJams.map(jam => <JamTile jam={jam} />)}
                    </div>
                </div>
                <div>
                    <h3 className="mono-header text-[#ea2155] drop-shadow-[0_1.4px_1.4px_rgba(0,0,0,0.8)] text-center text-2xl font-bold mb-4">Starting soon</h3>
                    <h4>Get in early on the newest and rising jams</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                        {newestJams.map(jam => <JamTile jam={jam} />)}
                    </div>
                </div>
                <div>
                    <h3 className="mono-header text-[#ea2155] drop-shadow-[0_1.4px_1.4px_rgba(0,0,0,0.8)] text-center text-2xl font-bold mb-4">Not sure?</h3>
                    <h4>The LFG board is for any and all projects!</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                        <LFGJamTile />
                    </div>
                </div>
            </div>
        </main>
    )
}

const JamTile: React.FC<{jam: Jam}> = ({ jam }) => {
    const start = new Date(Date.parse(jam.start))
    const daysInFuture = Math.ceil(Math.abs(start.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return (
        <a href={jam.jamId} className="mb-4">
            <section className="h-full bg-grey-500 border-2 border-neutral-900 rounded-xl p-4 flex flex-col justify-evenly">
                <img src={jam.logoStackedUrl} alt={jam.name} className="mx-auto mb-8 h-[128px] bg-gray-700" />
                <h2 className="text-xl font-bold text-center mb-2 whitespace-break-spaces">{jam.name}</h2>
                <h3>{jam.participants} participants</h3>
                <p className="text-xs">Starts in {daysInFuture} days</p>
            </section>
        </a>
    )
}

const LFGJamTile: React.FC = () => {
    return (
        <a href={'/lfg'} className="mb-4">
            <section className="h-full  bg-grey-500 border-2 border-neutral-900 rounded-xl p-4 flex flex-col justify-evenly">
                <img src={'https://cdn2.thecatapi.com/images/gLh13vDBk.jpg'} alt={''} className="mx-auto mb-8 h-[128px] bg-gray-700" />
                <h2 className="text-xl font-bold text-center mb-2 whitespace-break-spaces">LFG Board</h2>
                <h3>X active posts</h3>
                <p className="text-xs">For whatever your team finding needs are</p>
            </section>
        </a>
    )
}