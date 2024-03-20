import React, {useEffect, useState} from "react";
import {useMatch} from "react-router-dom";

type Jam = {
    jamId: String,
    styles: Map<String, String>,
}

export const JamSpecificStyling: React.FC = () => {
    const jamId = useMatch("/:jamId/:postId?")?.params.jamId!!;
    const [activeTheme, setActiveTheme] = useState<Jam>()

    // TODO: Cache and avoid refetch
    // TODO: TTL for styles?
    useEffect(() => {
        if (!jamId) return

        fetch(`${import.meta.env.VITE_API_URL}/jams`)
            .then(res => res.json() as Promise<Jam[]>)
            .then(s => s.find(x => x.jamId === jamId))
            .then(jam => setActiveTheme(jam))

    }, [jamId])

    if (!activeTheme) return

    localStorage.setItem(`theme_${jamId}`, JSON.stringify(activeTheme))

    const styles = Object.entries(activeTheme['styles'])
    styles.map(style => document.documentElement.style.setProperty(style[0], style[1]))

    return (<></>)
}