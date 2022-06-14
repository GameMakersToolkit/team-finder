import * as React from "react";
import { Link, useMatch } from "react-router-dom";
import { useState } from "react";
import { useMedia } from "react-use";
import defaultTheme from "tailwindcss/defaultTheme";
import cx from "classnames";
import { useUserInfo } from "../../queries/userInfo";
import { login } from "../../utils/login";
import { useMyPostQuery } from "../../queries/my-post";

const navMenuElementStylingRules =
  "w-full py-2 border mb-2 rounded text-center hover:bg-primary-highlight";
const navInlineElementStylingRules = `mr-2 border rounded leading-none py-2 px-2 hover:bg-primary-highlight`;

interface LinkData {
  label: string;
  to: string;
}

export const PageHeader: React.FC = () => {
  const userInfo = useUserInfo();
  const myPostQuery = useMyPostQuery();

  // Note: this assumes that we haven't made any changes to the
  // default Tailwind theme's responsive breakpoints.
  type TailwindScreenSizes = { [key: string]: string };
  const largeScreenQuery = `(min-width: ${
    (defaultTheme.screens as TailwindScreenSizes).lg
  })`;
  const isLargeScreen = useMedia(largeScreenQuery);

  const shouldDisplayLogin = !userInfo.data;
  const shouldDisplayAdminLink = userInfo.data?.isAdmin;

  const [isNavVisible, setNavVisibility] = useState(false);

  const links: LinkData[] = [
    {
      label: "Home",
      to: "/",
    },
    {
      label: myPostQuery?.data ? `Edit my Post` : `Create a Post`,
      to: "/my-post",
    },
    {
      label: "About",
      to: "/faq",
    },
  ];
  if (shouldDisplayAdminLink) {
    links.push({
      label: "Admin tools",
      to: "/admin",
    });
  }

  return (
    <div className="bg-black h-full mx-auto">
      {/* Static Inline Header */}
      <div className="flex flex-cols-2 border-b-2">
        <Link to="/">
          <img
            src="/logos/header.png"
            width={100}
            alt={"GMTK Game Jam 2022 Team Finder"}
          />
        </Link>
        {isLargeScreen && (
          <div className="flex items-center">
            {links.map((link) => (
              <InlineNavLink key={link.to} linkData={link} />
            ))}
          </div>
        )}

        {/* spacer */}
        <div className="flex-1" />

        <div className="flex items-center">
          {shouldDisplayLogin ? (
            <button
              className={`rounded-lg font-bold mr-4 px-5 py-1 bg-primary ${
                userInfo.isLoading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={login}
              disabled={userInfo.isLoading}
            >
              {userInfo.isLoading ? "Loading..." : "Log In"}
            </button>
          ) : (
            <p className="mr-4">
              Welcome {userInfo.data?.username}! (
              <Link to="/logout" className="cursor-pointer hover:underline">
                Click to logout
              </Link>
              )
            </p>
          )}
          {!isLargeScreen && (
            <ShowHideNavButton
              isNavVisible={isNavVisible}
              setNavVisibility={setNavVisibility}
            />
          )}
        </div>
      </div>

      {/* Toggleable navbar */}
      {/* TODO: Animate navbar visibility? */}
      {isNavVisible && !isLargeScreen && (
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
  const isMatch = useMatch({ path: linkData.to, end: true });
  return (
    <Link
      className={cx(navInlineElementStylingRules, {
        "bg-primary": isMatch,
      })}
      to={linkData.to}
    >
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
