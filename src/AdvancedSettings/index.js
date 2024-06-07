/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { useTranslation } from "react-i18next";

import BandwidthSelling from "./BandwidthSelling";
import Blockchain from "./Blockchain";
import OperatorFee from "./OperatorFee";
import NodeInformation from "./NodeInformation";
import NetworkOrganizer from "./NetworkOrganizer";
import RemoteAccess from "./RemoteAccess";
import RemoteLogging from "./RemoteLogging";
import MeshAP from "./MeshAP";

import exclamation from "images/exclamation.svg";

export default () => {
  let [t] = useTranslation();

  return (
    <div>
      <h2 id="advancedPage">{t("advancedSettings")}</h2>

      <div className="d-flex mb-3">
        <img
          src={exclamation}
          alt={t("exclamationMark")}
          style={{ width: 40, marginTop: -12 }}
          className="mr-2"
        />
        <p>{t("theseSettings")}</p>
      </div>

      <NetworkOrganizer />
      <div
        className="d-flex flex-wrap"
        style={{ justifyContent: "space-evenly" }}
      >
        <BandwidthSelling />
        <Blockchain />
      </div>
      <NodeInformation />
      <div
        className="d-flex flex-wrap"
        style={{ justifyContent: "space-evenly" }}
      >
        <RemoteAccess />
        <RemoteLogging />
      </div>

      <div
        className="d-flex flex-wrap"
        style={{ justifyContent: "space-evenly" }}
      >
        <MeshAP />
      </div>
      <OperatorFee />
    </div>
  );
};
