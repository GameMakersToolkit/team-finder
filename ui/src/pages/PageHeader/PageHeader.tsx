import * as React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useUserInfo } from "../../queries/userInfo";
import { login } from "../../utils/login";

const navElementStylingRules = "w-full py-2 border mb-2 rounded text-center ";

export const PageHeader: React.FC = () => {
  const userInfo = useUserInfo();

  const shouldDisplayLogin = !userInfo.data;
  const shouldDisplayAdminLink = userInfo.data?.isAdmin;

  const [isNavVisible, setNavVisibility] = useState(false);

  return (
    <div className="bg-lightbg h-full mx-auto">
      {/* Static Inline Header */}
      <div className="flex flex-cols-2 justify-between">
        <Link to="/">
          <h1 className="text-xl uppercase font-bold ml-4 px-1 py-1">
            Team
            <br />
            Finder
          </h1>
        </Link>
        <div className="flex items-center">
          {shouldDisplayLogin && (
            <button
              className="rounded-lg font-bold mr-4 px-5 py-1"
              style={{ backgroundColor: "#39bcf8" }}
              onClick={login}
            >
              Log In
            </button>
          )}
          <ShowHideNavButton
            isNavVisible={isNavVisible}
            setNavVisibility={setNavVisibility}
          />
        </div>
      </div>

      {/* Toggleable navbar */}
      {/* TODO: Animate navbar visibility? */}
      {isNavVisible && (
        <nav
          className={
            "border-t-4 grid grid-cols-1 justify-items-center content-center px-4 py-4"
          }
        >
          <Link className={navElementStylingRules} onClick={() => setNavVisibility(false)} to="/">
            Home
          </Link>
          <Link className={navElementStylingRules} onClick={() => setNavVisibility(false)} to="/my-post">
            My Post
          </Link>
          <Link className={navElementStylingRules} onClick={() => setNavVisibility(false)} to="/faq">
            FAQ
          </Link>
          {shouldDisplayAdminLink && (
            <Link className={navElementStylingRules} onClick={() => setNavVisibility(false)} to="/admin">
              Admin tools
            </Link>
          )}
        </nav>
      )}
    </div>
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
