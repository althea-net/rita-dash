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

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  console.log(navigator.userAgent);
  let tag = document.createElement("script");
  tag.type = "text/javascript";
  document.body.appendChild(tag);
  tag.src = "cordova.js";

  document.addEventListener("deviceready", () => {
    const sgap = window.sgap;
    sgap.setKey('pk_test_Ldy7TLYtmnsv1VrI4ULriWSd').then(function(output) {
      sgap.isReadyToPay().then(function() {
        sgap.requestPayment(1000, 'AUD').then(function(token) {
          alert(token);
        }).catch(function(err) {
          alert(err);
        });
      }).catch(function(err) {
        alert(err);
      });
    }).catch(function(err) {
      alert(err);
    });
  } , false);
}
