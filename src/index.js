import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import Store from "./Store.js";
import registerServiceWorker from "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.css";

ReactDOM.render(
  <Store
    initState={{ page: "" }}
    setters={{
      changePage: state => page => ({
        ...state,
        page
      }),
      gotWifiSettings: state => wifiSettings => ({
        ...state,
        wifiSettings
      })
    }}
  >
    <App />
  </Store>,
  document.getElementById("root")
);
registerServiceWorker();
