import * as React from "react";
import { NavLink } from "react-router-dom";

const NavTab: React.FC<{to: string}> = ({children, ...props}) => (
  <NavLink
    {...props}
    exact={true}
    activeClassName="text-primary font-medium"
    activeStyle={{transform: "translate(0px, 1px)", borderWidth: "3px 3px 0 3px", background:"linear-gradient(#333, #000)"}}
    className="leading-tight text-2xl font-light bg-black py-3 px-4 w-48 text-white text-center uppercase whitespace-pre rounded-t-lg border-t border-l border-r"
  >
    {children}
  </NavLink>
)

export const PageNavigator: React.FC = () => (
  <div className="flex flex-row justify-center items-center space-x-4 my-8 border-b border-white">
    <NavTab to="/">Team<br/>Finder</NavTab>
    <NavTab to="/register">Post / Edit<br/>Your Team</NavTab>
    <NavTab to="/about">Help /<br/>About</NavTab>
  </div>
);

