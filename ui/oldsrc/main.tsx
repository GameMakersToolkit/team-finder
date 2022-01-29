import "focus-visible";
import React from "react";
import ReactDOM from "react-dom";
import { NavLink } from "react-router-dom";
import { ReactQueryDevtools } from 'react-query/devtools'
import { Context } from "../src/Context";
import { Routes } from "./Routes";
import { PageNavigator } from "./components/PageNavigator";
import { PageContainer } from "./components/PageContainer";
import { StatusMessenger } from "./components/StatusMessenger";
import { importMetaEnv } from "../src/utils/importMeta";

import "tailwindcss/tailwind.css";
import "./index.css";


if (importMetaEnv().PROD) {
  import('../src/utils/init-sentry');
}

ReactDOM.render(
  <React.StrictMode>
    <Context>
      <PageContainer>
        <NavLink to="/">
          <div className="text-center">
            {/* TODO: Resize and optimise this image before launch */}
            <img
              className="inline-block my-6"
              src="/MainLogo100px.png"
              width={318}
              height={100}
              alt="GMTK Game Jam 2021 - Team Finder"
            />
          </div>
        </NavLink>
        <PageNavigator/>
        <Routes />
      </PageContainer>
      <ReactQueryDevtools />
      <StatusMessenger />
    </Context>
  </React.StrictMode>,
  document.getElementById("root")
);