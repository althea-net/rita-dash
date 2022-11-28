/* eslint-disable import/no-anonymous-default-export */
import { React } from "react";
import { useTranslation } from "react-i18next";
import { InputGroup } from "reactstrap";
import Devices from "./Devices";

const LanDevices = () => {
  let [t] = useTranslation();

  return (
    <div>
      <InputGroup>
        <h2 id="devicesPage">{t("devicesLan")}</h2>
      </InputGroup>
      <Devices />
    </div>
  );
};

export default LanDevices;
