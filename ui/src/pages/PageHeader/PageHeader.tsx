import * as React from "react";
import { Link, useMatch } from "react-router-dom";
import { useState } from "react";
import { useMedia } from "react-use";
import { toast } from "react-hot-toast";
import defaultTheme from "tailwindcss/defaultTheme";
import cx from "classnames";
import { useUserInfo } from "../../queries/userInfo";
import { login } from "../../utils/login";
import { useMyPostQuery } from "../../queries/my-post";
import {importMetaEnv} from "../../utils/importMeta";
import { JamState } from "../../utils/jamState";
import { useSearchParams } from "react-router-dom";
import { useUpdateSearchParam } from "../../utils/searchParam";
import favouriteSelectedIcon from "./icons/bookmark-selected.svg";
import favouriteNotSelectedIcon from "./icons/bookmark-unselected.svg";

import myPostIcon from "./icons/my-post.svg"

const jamName = importMetaEnv().VITE_JAM_NAME;

const navMenuElementStylingRules =
  "w-full py-2 border mb-2 rounded text-center hover:bg-primary-highlight";
const navInlineElementStylingRules = `mr-2 text-blue-300 leading-none py-2 px-2 hover:font-bold hover:text-white`;

interface LinkData {
  label: string;
  to?: string;
  icon?: string;
  onClick?: void;
}

export const PageHeader: React.FC<{jamState: JamState}> = ({jamState}) => {
  const userInfo = useUserInfo();
  const isLoggedIn = Boolean(userInfo?.data)
  const myPostQuery = useMyPostQuery();

  const [searchParams, setSearchParams] = useSearchParams();
  const updateSearchParam = useUpdateSearchParam(searchParams, setSearchParams);
  const [shouldLimitToFavourites, setShouldLimitToFavourites] = useState(false)

  // Note: this assumes that we haven't made any changes to the
  // default Tailwind theme's responsive breakpoints.
  type TailwindScreenSizes = { [key: string]: string };
  const largeScreenQuery = `(min-width: ${
    (defaultTheme.screens as TailwindScreenSizes).md
  })`;
  const shouldShowHorizontalLinks = useMedia(largeScreenQuery);

  const shouldDisplayLogin = !userInfo.data;
  const shouldDisplayAdminLink = userInfo.data?.isAdmin;

  const [isNavVisible, setNavVisibility] = useState(false);

  const bookmarkIconOnClick = (favourites) => {
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
    updateSearchParam("bookmarked", favourites ? favourites : null)
  }


  if (jamState == JamState.Before || jamState == JamState.After) {
    return (<></>);
  }

  return (
    <div className="bg-black h-full mx-auto p-2 mb-6">
      {/* Static Inline Header */}
      <div className="flex flex-cols-2">
        <Link to="/">
          <img
            src="/logos/header.png"
            width="40"
            height="40"
            alt={jamName + " Team Finder logo"}
          />
        </Link>
        {shouldShowHorizontalLinks && (
          <div className="flex items-center">
            <InlineNavLink key={"Home"} linkData={{to: "/", label: "Home"}} />
            <InlineNavLink key={"About"} linkData={{to: "/about", label: "About"}} />
            {shouldDisplayAdminLink && <InlineNavLink key={"Admin"} linkData={{to: "/admin", label: "Admin"}} />}
          </div>
        )}

        {/* spacer */}
        <div className="flex-1" />

        <div className="flex items-center">
          <InlineNavLink key={"Bookmarks"} linkData={{onClick: () => bookmarkIconOnClick(!shouldLimitToFavourites), icon: shouldLimitToFavourites ? favouriteSelectedIcon : favouriteNotSelectedIcon, style: "border border-blue-300 rounded-xl"}} />
          <InlineNavLink key={"Edit"} linkData={{to: "/my-post", icon: myPostIcon, label: 'Create post',  style: "border border-blue-300 rounded-xl"}} />

          {shouldDisplayLogin ? (
            <button
              className={`rounded-lg border border-blue-300 bg-blue-300 text-black font-bold mr-4 px-5 py-1 ${
                userInfo.isLoading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={login}
              disabled={userInfo.isLoading}
            >
              {userInfo.isLoading ? "Loading..." : "Login"}
            </button>
          ) : (
            <p className="sm:mr-4 text-xs sm:text-base">
              Welcome {userInfo.data?.username as string}!
              <Link to="/logout" className="block sm:inline sm:ml-1 cursor-pointer hover:underline">
                (Click here to logout)
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const InlineNavLink: React.FC<{ linkData: LinkData }> = ({
  linkData,
}) => {
  const isMatch = linkData.to && useMatch({ path: linkData.to, end: true });

    // <Link> always adds a href which messes up the onclick behaviour
    if (linkData.onClick) {
        return (
            <button
                className={cx(navInlineElementStylingRules, linkData.style, {
                    "font-bold": isMatch,
                })}
                to={linkData.to}
                onClick={linkData.onClick}
            >
                {linkData.icon && (
                  <img
                    src={linkData.icon}
                    className="inline-block"
                    style={{ width: "20px", height: "20px" }}
                  />
                )}

                {linkData.label}
            </button>
        )
    }

    return (
      <Link
        className={cx(navInlineElementStylingRules, linkData.style, {
          "font-bold": isMatch,
        })}
        to={linkData.to}
        onClick={linkData.onClick}
      >
        {linkData.icon && (
           <img
            src={linkData.icon}
            className="inline-block"
            style={{ width: "20px", height: "20px" }}
            />
        )}

        {linkData.label}
      </Link>
    );
};
