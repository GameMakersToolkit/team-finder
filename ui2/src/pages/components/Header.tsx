import React, {useState} from "react";
import {Link, useSearchParams} from "react-router-dom";
import {useUserInfo} from "../../api/userInfo.ts";
import {login} from "../../api/login.ts";
// Probably a better way to manage these
import favouriteSelectedIcon from "../../assets/icons/bookmark/selected.svg";
import favouriteNotSelectedIcon from "../../assets/icons/bookmark/unselected.svg";
import myPostIcon from "../../assets/icons/posts/my-post.svg"
import {toast} from "react-hot-toast";
import {useMyPostQuery} from "../../api/myPost.ts";

export const Header: React.FC = () => {
    // TODO: This doesn't work properly, probably use a react thing instead
    const isOnHomePage = window.location.pathname === "/"
    const userInfo = useUserInfo();
    const shouldDisplayAdminLink = Boolean(userInfo.data?.isAdmin);

    return (
        <>
            <nav className="c-header">
                <div className="flex flex-cols-2">
                    <Link to="/">
                        <img
                            src="/logos/header.png"
                            width="40"
                            height="40"
                            alt={"jamName" + " Team Finder logo"}
                        />
                    </Link>

                    <div className="flex items-center">
                        <Link className="header-text-link" key={"Home"} to={"/"}>Home</Link>
                        <Link className="header-text-link" key={"About"} to={"/about"}>About</Link>
                        <Link className="header-text-link" key={"How to use"} to={"/about#how-to-use"}>How to use</Link>
                        {shouldDisplayAdminLink && <Link className="header-text-link" key={"Admin"} to={"/admin"}>Admin</Link>}
                    </div>

                    {/* spacer */}
                    <div className="flex-1" />

                    <div className="flex items-center">
                        {isOnHomePage && <ToggleBookmarks />}
                        <MyPostButton />
                        <LoginLogout />
                    </div>
                </div>
            </nav>
        </>
    )
}

const ToggleBookmarks: React.FC = () => {
    const userInfo = useUserInfo();
    const isLoggedIn = Boolean(userInfo?.data)
    const [searchParams, setSearchParams] = useSearchParams();
    const [shouldLimitToFavourites, setShouldLimitToFavourites] = useState(!!searchParams.get("bookmarked") || false)

    const bookmarkIconOnClick = (favourites: boolean) => {
        if (!isLoggedIn) {
            toast("You must be logged in view your bookmarked posts", {
                icon: "🔒",
                id: "favourite-post-view-info",
            });
            console.log("toast called")
            return;
        }

        setShouldLimitToFavourites(favourites)
        // Using 'null' instead of 'false' will delete the key and automatically toggle
        // apiRequest() from /posts to /favourites and back again
        setSearchParams(params => {
            params.set("bookmarked", favourites ? "true" : "")
            return params
        })
    }

    return (
        <button
            id="toggle-bookmark-button"
            onClick={() => bookmarkIconOnClick(!shouldLimitToFavourites)}
        >
            <img
                src={shouldLimitToFavourites ? favouriteSelectedIcon : favouriteNotSelectedIcon}
                alt={shouldLimitToFavourites ? "Show all posts" : "Filter to your bookmarked posts"}
                className="inline-block"
                style={{ width: "20px", height: "20px" }}
            />
        </button>
    )
}

const MyPostButton: React.FC = () => {
    const userInfo = useUserInfo();
    const myPostQuery = useMyPostQuery();

    return (
        <Link
            className={`header-button ${userInfo.isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
            to="/my-post"
        >
            <img
                src={myPostIcon}
                alt={myPostQuery?.data ? "Edit post" : "Create post"}
                className="inline-block"
                style={{ width: "20px", height: "20px" }}
            />
            {myPostQuery?.data ? "Edit post" : "Create post"}
        </Link>
    )
}

const LoginLogout: React.FC = () => {
    const userInfo = useUserInfo();
    const shouldDisplayLogin = !userInfo.data;

    if (shouldDisplayLogin) {
        return (
            <button
                id="login-button"
                className={`header-button ${userInfo.isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => login()}
                disabled={userInfo.isLoading}
            >
                {userInfo.isLoading ? "Loading..." : "Login"}
            </button>
        )
    }

    return (
        <p className="sm:mr-4 text-xs sm:text-base">
            Welcome {userInfo.data?.username as string}!
            <Link to="/logout" className="block sm:inline sm:ml-1 cursor-pointer hover:underline">
                (Click here to logout)
            </Link>
        </p>
    )
}