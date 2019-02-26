import React from "react";
import { useTranslation } from "react-i18next";

import { PortColumn, PortNumber, PortToggle } from "./PortStyles.js";

import portOrderings from "../portOrderings";
import portImage from "images/port.png";

const PortColumns = ({ device, interfaces, setInterfaceMode }) => {
  let [t] = useTranslation();
  let modes = [t("LAN"), t("Mesh"), t("WAN")];

  return (
    <div className="d-flex flex-wrap justify-content-center mb-2 mx-0 px-0">
      {portOrderings[device].map((iface, i) => {
        let last = i === portOrderings[device].length - 1;

        return (
          <PortColumn last={last} key={i}>
            <img src={portImage} alt={iface} width="60px" />
            <PortNumber>{i + 1}</PortNumber>

            <div className="d-flex flex-column mt-3">
              {modes.map((mode, i) => {
                let disabled =
                  mode !== "Mesh" && Object.values(interfaces).includes(mode);
                return (
                  <PortToggle
                    key={i}
                    selected={mode === interfaces[iface]}
                    onClick={() => setInterfaceMode(iface, mode)}
                    disabled={disabled}
                  >
                    {mode}
                  </PortToggle>
                );
              })}
            </div>
          </PortColumn>
        );
      })}
    </div>
  );
};

export default PortColumns;
