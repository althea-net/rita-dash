import React from "react";
import { useTranslation } from "react-i18next";

import { Alert } from "reactstrap";
import { PortColumn, PortNumber, PortToggle } from "./PortStyles.js";

import portOrderings from "../portOrderings";
import portImage from "images/port.png";

const PortColumns = ({ device, interfaces, setInterfaceMode }) => {
  let [t] = useTranslation();
  let modes = [t("Lan"), t("Mesh"), t("Phone"), t("Wan")];

  if (!portOrderings[device])
    return <Alert color="danger">{t("deviceNotRecognized")}</Alert>;

  return (
    <div className="d-flex flex-wrap justify-content-center mb-2 mx-0 px-0">
      {portOrderings[device].map((iface, i) => {
        let last = i === portOrderings[device].length - 1;
        let column = i;

        return (
          <PortColumn last={last} key={i}>
            <img src={portImage} alt={iface} width="60px" />
            <PortNumber id={"port_" + i}>{i + 1}</PortNumber>

            <div className="d-flex w-100 flex-column mt-3">
              {modes.map((mode, i) => {
                let currentInterface = interfaces[iface];
                // static wan is a special case because it's an object
                // in this case we just map it to wan
                if (
                  currentInterface != null &&
                  interfaces[iface].StaticWAN != null
                ) {
                  currentInterface = "Wan";
                }
                let selected = mode === currentInterface;
                let disabled =
                  !selected &&
                  mode === "Wan" &&
                  Object.values(interfaces).includes(mode);
                return (
                  <PortToggle
                    id={mode + "_" + column}
                    key={i}
                    selected={selected}
                    onClick={() => selected || setInterfaceMode(iface, mode)}
                    disabled={disabled}
                    readOnly={selected}
                    className="active"
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
