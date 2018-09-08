import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
// import registerServiceWorker from "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.css";
import "./styles/bootstrap-overrides.css";
import { Provider, subscribe } from "./store";

import "./i18n";

subscribe((action, state) => {
  console.log("action:", action, state);
});

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById("root")
);
// registerServiceWorker();
