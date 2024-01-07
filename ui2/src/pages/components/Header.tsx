import React from "react";
import {Link} from "react-router-dom";

export const Header: React.FC = () => {
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
                    {/*{shouldShowHorizontalLinks && (*/}
                    {/*    <div className="flex items-center">*/}
                    {/*        <InlineNavLink key={"Home"} linkData={{to: "/", label: "Home"}} />*/}
                    {/*        <InlineNavLink key={"About"} linkData={{to: "/about", label: "About"}} />*/}
                    {/*        <InlineNavLink key={"How to use"} linkData={{to: "/about#how-to-use", label: "How to use"}} />*/}
                    {/*        {shouldDisplayAdminLink && <InlineNavLink key={"Admin"} linkData={{to: "/admin", label: "Admin"}} />}*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    {/* spacer */}
                    <div className="flex-1" />

                    <div className="flex items-center">
                        {/*{isOnHomePage && <InlineNavLink key={"Bookmarks"} linkData={{onClick: () => bookmarkIconOnClick(!shouldLimitToFavourites), icon: shouldLimitToFavourites ? favouriteSelectedIcon : favouriteNotSelectedIcon, style: "border border-blue-300 rounded-xl", alt: shouldLimitToFavourites ? "Show all posts" : "Filter to your bookmarked posts"}} />}*/}
                        {/*<InlineNavLink key={"Edit"} linkData={{to: "/my-post", icon: myPostIcon, label: myPostQuery?.data ? 'Edit post' : 'Create post',  style: "border border-blue-300 rounded-xl"}} />*/}

                        <LoginLogout />
                    </div>
                </div>
            </nav>
        </>
    )
}

const LoginLogout: React.FC = () => {
    const userInfo = {isLoading: false, data: {username: "Developer"}};// useUserInfo();
    const shouldDisplayLogin = true; //!userInfo.data;

    if (shouldDisplayLogin) {
        return (
            <>
                <button
                    className={`rounded-lg border border-blue-300 bg-blue-300 text-black font-bold mr-4 px-5 py-1 ${
                        userInfo.isLoading ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    onClick={() => console.log("login time")}
                    disabled={userInfo.isLoading}
                >
                    {userInfo.isLoading ? "Loading..." : "Login"}
                </button>
            </>
        )
    }

    return (
        <>
            <p className="sm:mr-4 text-xs sm:text-base">
                Welcome {userInfo.data?.username as string}!
                <Link to="/logout" className="block sm:inline sm:ml-1 cursor-pointer hover:underline">
                    (Click here to logout)
                </Link>
            </p>
        </>
    )
}