import React, {createContext, useEffect, useState} from "react";
import {useMatch} from "react-router-dom";

type Jam = {
    jamId: string,
    logoLargeUrl: string,
    logoStackedUrl: string,
    styles: object,
    expiry: number,
}

// Used on homepage etc. which don't have a theme
const defaultThemeContext: Jam = {
    jamId: "",
    logoLargeUrl: "",
    logoStackedUrl: "",
    styles: {},
    expiry: Date.now()
}

export const JamSpecificThemeContext = createContext<Jam>(defaultThemeContext)

export const JamSpecificStyling: React.FC<{children: any}> = ({children}) => {
    const jamId = useMatch("/:jamId/:postId?")?.params.jamId!!;
    const [activeTheme, setActiveTheme] = useState<Jam>()
    useEffect(() => {
        if (!jamId) return

        const cachedThemeStr = localStorage.getItem(`theme_${jamId}`)
        if (cachedThemeStr) {
            const cachedTheme = JSON.parse(cachedThemeStr) as Jam
            if (cachedTheme.expiry > Date.now()) {
                setActiveTheme(cachedTheme)
                return
            }
        }

        fetch(`${import.meta.env.VITE_API_URL}/jams/${jamId}`)
            .then(async res => {
                const data = await res.json()
                if (res.ok) {
                    data.expiry = Date.now() + 6*60*60*1000 // 6 hours expiry
                    return data as Jam
                }

                return Promise.reject(data['message'])
            })
            .then(jam => setActiveTheme(jam))

    }, [jamId])

    // Ignore theme handling for non-jam pages
    // TODO: Fix this, it's just so so gross; should be fixed when a base site theme exists
    console.log(window.location.pathname)
    if (['/', '/about', '/login', '/login/authorized', '/logout'].includes(window.location.pathname)) {
        return (
            <JamSpecificThemeContext.Provider value={defaultThemeContext}>
                {children}
            </JamSpecificThemeContext.Provider>
        )
    }

    // If searching for a jam by ID and not finding it:
    if (jamId && activeTheme == null) {
        return (<>No jam of that ID could be found</>)
    }

    localStorage.setItem(`theme_${jamId}`, JSON.stringify(activeTheme))

    const styles = Object.entries(activeTheme?.styles || {})
    styles.map(style => document.documentElement.style.setProperty(style[0], style[1]))

    return (
        <JamSpecificThemeContext.Provider value={activeTheme!!}>
            {children}
        </JamSpecificThemeContext.Provider>
    )
}