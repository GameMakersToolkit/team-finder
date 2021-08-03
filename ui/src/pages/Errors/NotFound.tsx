import * as React from "react";
import { NavLink } from "react-router-dom";

export const NotFound: React.FC = () => {
  return (<>
    <p>We couldn&apos;t find the page you were looking for.</p>
    <p><NavLink to="/">Click here to continue using this site.</NavLink></p>
  </>)
}
