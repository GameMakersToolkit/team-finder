import React, {createContext} from "react"
import {useParams, Navigate} from 'react-router-dom'
import {Header} from "../../pages/components/Header.tsx"
import Footer from "../../pages/components/Footer.tsx"
import { useJam } from "../../api/jam"
import { Jam } from "../models/jam.ts"


// TODO: How do you handle createContext properly?
export const JamSpecificContext = createContext<Jam>(undefined!)

export const JamSpecificStyling: React.FC<{children: any}> = ({children}) => {
    const { jamId } = useParams()
    const { data: activeJam, isLoading, isError, error } = useJam(jamId)

    if (isLoading) return null
    if (isError) return <>{error?.message || 'No jam of that ID could be found'}</>
    if (!activeJam) return null

    // Lazy redirect to show end screen
    const jamHasExpired = new Date(activeJam.end) < new Date()
    const isViewingAnyJamPage = window.location.pathname !== `/${activeJam.jamId}/finished`
    if (jamHasExpired && isViewingAnyJamPage) {
        return <Navigate to={`/${activeJam.jamId}/finished`} replace />
    }

    localStorage.setItem(`theme_${jamId}`, JSON.stringify(activeJam))

    // Set each CSS rule in the DB active on the page
    Object.entries(activeJam.styles).map(style => document.documentElement.style.setProperty(style[0], style[1]))

    document.body.style.setProperty('background-image', `url("${activeJam.bgImageUrl}")`, 'important')
    document.title = `${activeJam.name} | findyourjam.team`

    return (
        <JamSpecificContext.Provider value={activeJam}>
            <Header isPreview={false} />
            {children}
            <Footer />
        </JamSpecificContext.Provider>
    )
}
