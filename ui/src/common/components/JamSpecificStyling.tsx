import React, {useEffect, useState} from "react";
import {useMatch} from "react-router-dom";

type Jam = {
    jamId: String,
    styles: Map<String, String>,
}

export const JamSpecificStyling: React.FC<{children: any}> = ({children}) => {
    const jamId = useMatch("/:jamId/:postId?")?.params.jamId!!;
    const [activeTheme, setActiveTheme] = useState<Jam>()

    // TODO: Cache and avoid refetch
    // TODO: TTL for styles?
    useEffect(() => {
        if (!jamId) return

        fetch(`${import.meta.env.VITE_API_URL}/jams/${jamId}`)
            .then(async res => {
                const data = await res.json()
                if (res.ok) return data as Jam

                return Promise.reject(data['message'])
            })
            .then(jam => setActiveTheme(jam))

    }, [jamId])

    // If searching for a jam by ID and not finding it:
    if (jamId && activeTheme == null) {
        return (<>No jam of that ID could be found</>)
    }

    localStorage.setItem(`theme_${jamId}`, JSON.stringify(activeTheme))

    const styles = Object.entries(activeTheme?.styles || {})
    styles.map(style => document.documentElement.style.setProperty(style[0], style[1]))

    return (
        <>
            {children}
        </>
    )
}