import "abortcontroller-polyfill";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/althea.scss";
import "./icons";
import { StateProvider } from "store";

import "./i18n";

ReactDOM.render(
  <StateProvider>
    <App />
  </StateProvider>,
  document.getElementById("root")
);

window.isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

if (window.isMobile) {
  let tag = document.createElement("script");
  tag.type = "text/javascript";
  document.body.appendChild(tag);
  tag.src = "cordova.js";
}
