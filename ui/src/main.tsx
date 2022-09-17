import "focus-visible";
import React from "react";
import ReactDOM from "react-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import { Context } from "./Context";
import { importMetaEnv } from "./utils/importMeta";
import { App } from "./App";
import "./index.css";

if (importMetaEnv().PROD) {
  import("../src/utils/init-sentry");
}

ReactDOM.render(
  <React.StrictMode>
    <Context>
      <React.Suspense fallback={null}>
        <App />
      </React.Suspense>
      <ReactQueryDevtools />
    </Context>
  </React.StrictMode>,
  document.getElementById("root")
);
