import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import Store from "./Store.js";
import { setters, initState } from "./setters";
import actions from "./actions";
import registerServiceWorker from "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.css";

ReactDOM.render(
  <Store initState={initState} setters={setters} actions={actions}>
    <App />
  </Store>,
  document.getElementById("root")
);
registerServiceWorker();
