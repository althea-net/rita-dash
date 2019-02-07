import React from "react";
import { actions, connect } from "../store";
import { withTranslation } from "react-i18next";

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

export default connect(["scanning"])(withTranslation()(CameraUI));
