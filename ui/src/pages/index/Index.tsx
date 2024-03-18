import {useEffect, useState} from "react";
import * as React from "react";

export const Index: React.FC = () => {

    const [jams, setJams] = useState([])
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/jams`)
            .then(res => res.json())
            .then(setJams)
    }, [])

    return (
        <main>
            <pre>{JSON.stringify(jams)}</pre>
        </main>
    )
}