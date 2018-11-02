import React from "react";
import { actions, connect } from "../store";
import { translate } from "react-i18next";
import "../styles/camera-controls.css";

const CameraUI = ({ state, t }) => {
  if (!state.scanning) return null;
  return (
    <div id="camcontrols">
      <div id="crosshair" />
      <div id="controls">
        <div id="cancel" onClick={() => actions.stopScanning()}>
          Stop
        </div>
      </div>
    </div>
  );
};

export default connect(["scanning"])(translate()(CameraUI));
