import * as React from "react";
import {SearchFormWrapper} from "./components/SearchFormWrapper.tsx";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";

export const Home: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState([])

    // Trigger API call every time query string changes
    useEffect(() => {
        console.log("http://localhost:8080/posts?" + searchParams.toString())
        fetch("http://localhost:8080/posts?" + searchParams.toString())
            .then(res => res.json())
            .then(setPosts)
    }, [searchParams])

    console.log(posts)

    return (
        <>
            <div className="container mx-auto max-w-screen-xxl p-1 px-4">
                <SearchFormWrapper searchParams={searchParams} setSearchParams={setSearchParams} />

                {posts.length && posts.map(post => <pre>{JSON.stringify(post)}</pre>)}
            </div>
        </>
    )
}