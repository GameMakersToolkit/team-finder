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

// TODO: Use both
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
      toast("You must be logged in view your favourite posts", {
        icon: "🔒",
        id: "favourite-post-view-info",
      });
      return;
    }

    setShouldLimitToFavourites(favourites)
    // Using 'null' instead of 'false' will delete the key and automatically toggle
    // apiRequest() from /posts to /favourites and back again
    updateSearchParam("favourites", favourites ? favourites : null)
    console.log("Why the f doesn't this work")
  }


  if (jamState == JamState.Before || jamState == JamState.After) {
    return (<></>);
  }

  return (
    <div className="bg-black h-full mx-auto">
      {/* Static Inline Header */}
      <div className="flex flex-cols-2 border-b-2">
        <Link to="/">
          <img
            src="/logos/header.png"
            width={100}
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
            <p className="mr-4">
              Welcome {userInfo.data?.username as string}! (
              <Link to="/logout" className="cursor-pointer hover:underline">
                Click to logout
              </Link>
              )
            </p>
          )}
          {!shouldShowHorizontalLinks && (
            <ShowHideNavButton
              isNavVisible={isNavVisible}
              setNavVisibility={setNavVisibility}
            />
          )}
        </div>
      </div>

      {/* Toggleable navbar */}
      {/* TODO: Animate navbar visibility? */}
      {isNavVisible && !shouldShowHorizontalLinks && (
        <nav
          className={
            "fixed w-full bg-black grid grid-cols-1 justify-items-center content-center px-4 py-4"
          }
          style={{
            zIndex: 100,
          }}
        >
          {links.map((link) => (
            <Link
              key={link.to}
              className={navMenuElementStylingRules}
              onClick={() => setNavVisibility(false)}
              to={link.to}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
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

const ShowHideNavButton: React.FC<{
  isNavVisible: boolean;
  setNavVisibility: (isNavVisible: boolean) => void;
}> = ({ isNavVisible, setNavVisibility }) => (
  <button
    className="flex-initial h-full w-16 border-l-2"
    onClick={() => setNavVisibility(!isNavVisible)}
    style={{
      borderImage:
        "linear-gradient(to bottom, #fd04f2 0% 33%, #f9fd03 33% 66%, #3abaf6 66% 100%) 2",
    }}
  >
    <div className="py-1">
      <svg
        className="fill-current h-8 mx-auto"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Menu</title>
        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
      </svg>
    </div>
  </button>
);
