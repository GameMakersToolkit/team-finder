import React, {createContext} from "react"
import {useParams, Navigate} from 'react-router-dom'
import {Header} from "../../pages/components/Header.tsx"
import Footer from "../../pages/components/Footer.tsx"
import { useJam } from "../../api/jam"
import { Jam } from "../models/jam.ts"
import { LoadingSpinner } from "./LoadingSpinner.tsx"
import { ErrorDisplay } from "./ErrorDisplay.tsx"
import { safeSetString } from "../utils/storageUtils.ts"


// TODO: How do you handle createContext properly?
export const JamSpecificContext = createContext<Jam>(undefined!)

export const JamSpecificStyling: React.FC<{children: React.ReactNode}> = ({children}) => {
    const { jamId } = useParams()
    const { data: activeJam, isLoading, isError, error } = useJam(jamId)

    if (isLoading) return <LoadingSpinner label="Loading jam settings..." />
    if (isError) {
      return (
        <ErrorDisplay
          title="Jam Not Available"
          message={error?.message || "No jam with that ID could be found."}
          actionLabel="Go home"
          onAction={() => window.location.assign("/")}
        />
      );
    }
    if (!activeJam) return <ErrorDisplay message="No jam with that ID could be found." />

    // Lazy redirect to show end screen
    const jamHasExpired = new Date(activeJam.end) < new Date()
    const isViewingAnyJamPage = window.location.pathname !== `/${activeJam.jamId}/finished` && !window.location.pathname.includes('/admin')
    if (jamHasExpired && isViewingAnyJamPage) {
        return <Navigate to={`/${activeJam.jamId}/finished`} replace />
    }

    safeSetString(`theme_${jamId}`, JSON.stringify(activeJam))

    // Set only CSS custom properties on the page; non-CSS metadata also lives in styles.
    Object.entries(activeJam.styles)
        .filter(([styleName]) => styleName.startsWith("--"))
        .forEach(style => document.documentElement.style.setProperty(style[0], style[1]))

    document.body.style.setProperty('background-image', `url("${activeJam.bgImageUrl}")`, 'important');
    document.title = `${activeJam.name} | Team Finder`;
    (document.getElementById("favicon") as HTMLLinkElement).href = activeJam.faviconUrl;


  return (
        <JamSpecificContext.Provider value={activeJam}>
            <Header isPreview={false} />
            {children}
            <Footer />
        </JamSpecificContext.Provider>
    )
}
