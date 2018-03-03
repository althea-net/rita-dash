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
      changePage: state => page => {
        console.log("changePage");
        return {
          ...state,
          page: page
        };
      },
      gotWifiSettings: state => wifiSettings => {
        console.log("gotWifiSettings");
        return {
          ...state,
          wifiSettings: wifiSettings
        };
      },
      savedWifiSetting: state => wifiSetting => {
        return {
          ...state,
          wifiSettings: state.wifiSettings.map(s => {
            if (s.device_name === wifiSetting.device_name) {
              return wifiSetting;
            }
            return s;
          })
        };
      }
    }}
  >
    <App />
  </Store>,
  document.getElementById("root")
);
registerServiceWorker();
