import React,  {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import {Header} from "../../pages/components/Header.tsx";
import Footer from "../../pages/components/Footer.tsx";
import { Jam, JamSpecificContext } from "./JamSpecificStyling.tsx";

export const getPreviewCacheKey = (jamId: string) => `theme_${jamId}_preview`

export const JamPreviewStyling: React.FC<{children: any}> = ({children}) => {
    const { jamId } = useParams()
    const [activeJam, setActiveJam] = useState<Jam>()

    useEffect(() => {
        const baseJamStr = localStorage.getItem(`theme_${jamId}`) || "{}"
        const baseJam = JSON.parse(baseJamStr) as Jam

        const key = getPreviewCacheKey(jamId!)
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(baseJam))
        }

        const previewJamStr = localStorage.getItem(key)!
        if (!previewJamStr) {
            console.warn("Where the jam string buddy");
        }
        const previewJam = JSON.parse(previewJamStr) as Jam
        setActiveJam({ ...baseJam, ...previewJam })
    }, [])

    if (activeJam == null) {
        // TODO: Temporal handling for first load
        return (<></>)
        // return (<>No jam of that ID could be found</>)
    }

    // Lazy redirect to show end screen
    Object.entries(activeJam.styles).map(style => document.documentElement.style.setProperty(style[0], style[1]))

    return (
        <JamSpecificContext.Provider value={activeJam}>
            <Header />
            {children}
            <Footer />
        </JamSpecificContext.Provider>
    )
}
