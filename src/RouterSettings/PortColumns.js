import React from "react";
import { useTranslation } from "react-i18next";

import { Alert, Button } from "reactstrap";
import { PortColumn, PortNumber, PortToggle } from "./PortStyles.js";
import { useStore } from "store";

import portOrderings from "../portOrderings";
import portImage from "images/port.png";

const DSA_MODELS = [
  "linksys_wrt3200acm",
  "linksys_wrt32x",
  "linksys_wrt1900acs",
  "linksys_wrt1900ac",
  "ubnt-erx",
  "ubnt-erx-sfp",
];

const PortColumns = ({
  device,
  interfaces,
  setInterfaceMode,
  setInterfaceChanges,
}) => {
  let [t] = useTranslation();
  const modes = [t("Lan"), t("Mesh"), t("LTE"), t("Wan")];
  const [{ version }] = useStore();
  function checkIfKeyLTE() {
    // if this is a KeyLTE router the LTE port assignment is disabled.
    let version_string = version.toLowerCase();
    if (version_string.includes("keylte")) {
      return true;
    } else {
      return false;
    }
  }

  const is_keyLTE = checkIfKeyLTE();

  // see if we have kernel v5 orderings
  const orderv5 = portOrderings[device];
  let order = orderv5;

  if (DSA_MODELS.includes(device)) {
    // get the interface port names
    const iface_keys = Object.keys(interfaces);

    // get kernel v4 orderings for pre-DSA
    const orderv4 = portOrderings[`${device}_v4`];

    // use v5 ifaces names, otherwise try v4
    order =
      orderv5 && iface_keys.includes(orderv5[0])
        ? orderv5
        : orderv4 && iface_keys.includes(orderv4[0])
        ? orderv4
        : null;
  }

  if (!order) return <Alert color="danger">{t("deviceNotRecognized")}</Alert>;

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-center mb-2 mx-0 px-0">
        {order.map((iface, i) => {
          let last = i === order.length - 1;
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
                    interfaces[iface].StaticWan != null
                  ) {
                    currentInterface = "Wan";
                  }
                  let selected = mode === currentInterface;
                  let disabled =
                    !selected &&
                    ((mode === "Wan" &&
                      Object.values(interfaces).includes(mode)) ||
                      (mode === "LTE" &&
                        (Object.values(interfaces).includes(mode) ||
                          is_keyLTE)));
                  return (
                    <PortToggle
                      id={mode + "_" + column}
                      key={i}
                      selected={selected}
                      onClick={() =>
                        selected || setInterfaceChanges(iface, mode)
                      }
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
      <Button onClick={setInterfaceMode} color="primary">
        {t("save")}
      </Button>
    </div>
  );
};

export default PortColumns;
