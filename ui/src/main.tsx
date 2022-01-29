import "focus-visible";
import React from "react";
import ReactDOM from "react-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import { Context } from "../src/Context";
import { importMetaEnv } from "../src/utils/importMeta";

import "tailwindcss/tailwind.css";
import "./index.css";

if (importMetaEnv().PROD) {
  import("../src/utils/init-sentry");
}

ReactDOM.render(
  <React.StrictMode>
    <Context>
      <h1>Hello World, UI goes here</h1>
      <ReactQueryDevtools />
    </Context>
  </React.StrictMode>,
  document.getElementById("root")
);
