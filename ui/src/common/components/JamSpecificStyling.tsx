import React, {createContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Header} from "../../pages/components/Header.tsx";
import Footer from "../../pages/components/Footer.tsx";

export type Jam = {
    jamId: string,
    name: string,
    participants: number,
    start: string,
    duration: string,
    logoLargeUrl: string,
    logoStackedUrl: string,
    styles: object,
    expiry: number,
}

// TODO: How do you handle createContext properly?
export const JamSpecificContext = createContext<Jam>(undefined!)

export const JamSpecificStyling: React.FC<{children: any}> = ({children}) => {
    const { jamId } = useParams()
    const [activeJam, setActiveJam] = useState<Jam>()

    useEffect(() => {
        const cachedJamStr = localStorage.getItem(`theme_${jamId}`)
        if (cachedJamStr) {
            const cachedJam = JSON.parse(cachedJamStr) as Jam
            if (cachedJam.expiry > Date.now()) {
                setActiveJam(cachedJam)
                return
            }
        }

        fetch(`${import.meta.env.VITE_API_URL}/jams/${jamId}`)
            .then(async res => {
                const data = await res.json()
                if (res.ok) {
                    data.expiry = Date.now() + 60*60*1000 // 1 hour expiry
                    return data as Jam
                }

                return Promise.reject(data['message'])
            })
            .then(jam => setActiveJam(jam))

    }, [jamId])

    if (activeJam == null) {
        return (<>No jam of that ID could be found</>)
    }

    // localStorage.setItem(`theme_${jamId}`, JSON.stringify(activeJam))

    // Set each CSS rule in the DB active on the page
    Object.entries(activeJam.styles).map(style => document.documentElement.style.setProperty(style[0], style[1]))

    return (
        <JamSpecificContext.Provider value={activeJam}>
            <Header />
            {children}
            <Footer />
        </JamSpecificContext.Provider>
    )
}