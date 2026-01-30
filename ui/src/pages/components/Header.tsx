import React, {useContext, useEffect, useState} from "react";
import {Link, useMatch, useNavigate, useSearchParams} from "react-router-dom";
import {useUserInfo} from "../../api/userInfo.ts";
import {login} from "../../api/login.ts";
// Probably a better way to manage these
import favouriteSelectedIcon from "../../assets/icons/bookmark/selected.svg";
import favouriteNotSelectedIcon from "../../assets/icons/bookmark/unselected.svg";
import myPostIcon from "../../assets/icons/posts/my-post.svg"
import {toast} from "react-hot-toast";
import {useMyPostQuery} from "../../api/myPost.ts";
import {ReactSVG} from "react-svg";
import {JamSpecificContext} from "../../common/components/JamSpecificStyling.tsx";

export const Header: React.FC<{isPreview: boolean}> = ({isPreview}) => {

    const theme = useContext(JamSpecificContext)
    const navigate = useNavigate();

    const page = window.location.pathname.replaceAll("/", "");
    const [isOnSearchPage, setIsOnSearchPage] = useState(page === theme.jamId);

    useEffect(() => {
        setIsOnSearchPage(page === theme.jamId)
    }, [navigate]);

    const userInfo = useUserInfo();
    const shouldDisplayAdminLink = Boolean(userInfo.data?.isAdmin);

    return (
        <>
            <nav className="c-header">
                <div className="sm:flex h-[40px]">
                    <div className="hidden sm:flex">
                        <Link to={`/${theme.jamId}`}>
                            <img src={theme.logoStackedUrl} width="40" height="40" alt={"jamName" + " Team Finder logo"} className="bg-black rounded-lg mr-2 hover:scale-125"/>
                        </Link>

                        <div className="flex items-center">
                            <Link className="header-text-link" key={"About"} to={`/${theme.jamId}/about`}>About / How To Use</Link>
                            <Link className="header-text-link" target="_blank" key={"Contact Support"} to={`https://discord.com/users/427486675409829898`}>Contact Support</Link>
                            {shouldDisplayAdminLink && <Link className="header-text-link" key={"Admin"} to={`/${theme.jamId}/admin`}>Admin</Link>}
                        </div>
                    </div>

                    {/* spacer */}
                    <div className="flex-1 hidden sm:flex" />

                    <div className="flex justify-evenly gap-2">
                        <Link to="/" className="bg-[var(--theme-accent-dark)] block rounded-lg mr-2 sm:hidden">
                            <img src={theme.logoStackedUrl} width="40" height="40" alt={"jamName" + " Team Finder logo"}/>
                        </Link>
                        {isOnSearchPage && <ToggleBookmarks />}
                        {isPreview ? <MyPostButtonVisual isEdit={false} /> : <MyPostButton />}

                        {isPreview ? <span className="sm:block pl-2 ml-auto w-[min-content]">Welcome admin!</span> : <LoginLogout />}
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
            <ReactSVG
                src={shouldLimitToFavourites ? favouriteSelectedIcon : favouriteNotSelectedIcon}
                desc={shouldLimitToFavourites ? "Show all posts" : "Filter to your bookmarked posts"}
                className="contents svg-explicit-size h-full fill-[color:var(--theme-text)] ml-2 my-1 mr-2"
                style={{ width: "20px", height: "20px" }}
                width={20}
                height={20}
            />
        </button>
    )
}

const MyPostButtonVisual: React.FC<{isEdit: boolean}> = ({isEdit}) => {
    return (
      <a className="header-button disabled">
          <div className="flex items-center h-full">
              <ReactSVG
                src={myPostIcon}
                desc={isEdit ? "Edit post" : "Create post"}
                className="svg-explicit-size h-full fill-[color:var(--theme-text)] inline-block ml-2 my-1 mr-2"
                style={{ width: "20px", height: "20px" }}
                width={20}
                height={20}
              />
              <span className="hover:font-bold align-middle">
                  <span className="text-xs sm:text-sm mr-2 sm:mr-0">{isEdit ? "Edit" : "Create"}</span>
                  <span className="text-xs sm:text-sm hidden sm:inline sm:mr-2">&nbsp;post</span>
              </span>
          </div>
      </a>
    )
}

const MyPostButton: React.FC = () => {
    // TODO: Get from storage somewhere
    const jamId = useMatch("/:jamId/:postId?")?.params.jamId;

    const userInfo = useUserInfo();
    const myPostQuery = useMyPostQuery();

    return (
        <Link
            className={`header-button ${userInfo.isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
            to={`/` + jamId + `/my-post`}
        >
            <MyPostButtonVisual isEdit={Boolean(myPostQuery?.data)} />
        </Link>
    )
}

const LoginLogout: React.FC = () => {
    const theme = useContext(JamSpecificContext)
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
            <Link to={`/logout?redirect=${theme.jamId}`} className="block sm:inline sm:ml-1 cursor-pointer hover:underline">
                (Click here to logout)
            </Link>
        </p>
    )
}
