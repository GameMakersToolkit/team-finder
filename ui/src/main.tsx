import "focus-visible";
import React from "react";
import ReactDOM from "react-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import { Context } from "../src/Context";
import { importMetaEnv } from "../src/utils/importMeta";

import { AppRoutes } from "./AppRoutes";
import PageHeader from "./pages/PageHeader";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { getJamState, JamState } from "./utils/jamState";

if (importMetaEnv().PROD) {
  import("../src/utils/init-sentry");
}

const jamState: JamState = getJamState()

ReactDOM.render(
  <React.StrictMode>
    <Context>
      <React.Suspense fallback={null}>
        <PageHeader jamState={jamState} />
        <AppRoutes jamState={jamState} />
        <Toaster
          position="bottom-center"
          reverseOrder={false}
        />
      </React.Suspense>
      <ReactQueryDevtools />
    </Context>
  </React.StrictMode>,
  document.getElementById("root")
);
