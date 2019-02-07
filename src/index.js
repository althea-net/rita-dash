import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./styles/althea.scss";
import { Provider } from "./store";

import "./i18n";

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById("root")
);

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  let tag = document.createElement("script");
  tag.type = "text/javascript";
  document.body.appendChild(tag);
  tag.src = "cordova.js";
}
