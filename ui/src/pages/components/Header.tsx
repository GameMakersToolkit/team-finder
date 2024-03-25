import React, {useEffect, useState} from "react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {useUserInfo} from "../../api/userInfo.ts";
import {login} from "../../api/login.ts";
// Probably a better way to manage these
import favouriteSelectedIcon from "../../assets/icons/bookmark/selected.svg";
import favouriteNotSelectedIcon from "../../assets/icons/bookmark/unselected.svg";
import myPostIcon from "../../assets/icons/posts/my-post.svg"
import {toast} from "react-hot-toast";
import {useMyPostQuery} from "../../api/myPost.ts";

const jamName = import.meta.env.VITE_JAM_NAME;

export const Header: React.FC = () => {

    const navigate = useNavigate();
    const [isOnSearchPage, setIsOnHomePage] = useState(window.location.pathname === "/gmtk");
    useEffect(() => {
        setIsOnHomePage(window.location.pathname === "/gmtk")
    }, [navigate]);

    const userInfo = useUserInfo();
    const shouldDisplayAdminLink = Boolean(userInfo.data?.isAdmin);

    return (
        <>
            <nav className="c-header">
                <div className="sm:flex h-[40px]">
                    <div className="hidden sm:flex">
                        <Link to="/gmtk">
                            <img src="/logos/jam-logo-stacked.webp" width="40" height="40" alt={jamName + " Team Finder logo"} className="bg-black border border-white rounded-lg mr-2 hover:scale-125"/>
                        </Link>

                        <div className="flex items-center">
                            <Link className="header-text-link" key={"About"} to={"/about"}>About / How To Use</Link>
                            {shouldDisplayAdminLink && <Link className="header-text-link" key={"Admin"} to={"/admin"}>Admin</Link>}
                        </div>
                    </div>

                    {/* spacer */}
                    <div className="flex-1 hidden sm:flex" />

                    <div className="flex justify-evenly gap-2">
                        <Link to="/gmtk" className="bg-theme-d-4 block border border-white rounded-lg mr-2 sm:hidden">
                            <img src="/logos/jam-logo-stacked.webp" width="40" height="40" alt={jamName + " Team Finder logo"}/>
                        </Link>
                        {isOnSearchPage && <ToggleBookmarks />}
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
            favourites ? params.set("bookmarked", "true") : params.delete("bookmarked")
            return params
        })
    }

    return (
        <button
            id="toggle-bookmark-button"
            className="header-button"
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
            to="/gmtk/my-post"
        >
            <div className="flex items-center h-full">
                <img src={myPostIcon} alt={myPostQuery?.data ? "Edit post" : "Create post"} className="h-full inline-block ml-2 my-1 mr-2" style={{ width: "20px", height: "20px" }}/>
                <span className="hover:font-bold align-middle">
                    <span className="text-xs sm:text-sm mr-2 sm:mr-0">{myPostQuery?.data ? "Edit" : "Create"}</span>
                    <span className="text-xs sm:text-sm hidden sm:inline sm:mr-2">&nbsp;post</span>
                </span>
            </div>
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
        <p className="sm:mr-4 text-right inline-grid sm:inline text-xs sm:text-sm">
            <span className="sm:block ml-auto w-[min-content]">Welcome&nbsp;{userInfo.data?.username as string}!</span>
            <Link to="/logout" className="block sm:inline sm:ml-1 cursor-pointer hover:underline">
                (Click here to logout)
            </Link>
        </p>
    )
}