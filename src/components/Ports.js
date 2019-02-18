import React, { useEffect, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Card, CardBody, Progress } from "reactstrap";
import { Context } from "../store";

import { Device } from "./PortStyles.js";
import PortColumns from "./PortColumns";
import Confirm from "./Confirm";

const Ports = () => {
  let [t] = useTranslation();
  let [open, setOpen] = useState(false);
  let [confirmIface, setConfirmIface] = useState("");
  let [mode, setMode] = useState("");

  let {
    actions,
    state: { initializing, info, loadingInterfaces, interfaces }
  } = useContext(Context);

  useEffect(() => {
    actions.getInterfaces();
    let timer = setInterval(actions.getInterfaces, 10000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  let setInterfaceMode = (iface, mode) => {
    setConfirmIface(iface);
    setMode(mode);
    setOpen(true);
  };

  let { device } = info;

  if (!interfaces)
    if (loadingInterfaces === false) {
      return <Alert color="info">{t("noInterfaces")}</Alert>;
    } else
      return initializing ? (
        <Progress animated color="info" value={100} />
      ) : null;

  if (!device) return <Alert color="danger">{t("noDevice")}</Alert>;

  return (
    <div>
      <Confirm open={open} setOpen={setOpen} iface={confirmIface} mode={mode} />

      <Card>
        <CardBody>
          <h2 style={{ marginTop: 20 }}>{t("ports")}</h2>

          <p style={{ color: "gray", fontSize: 14 }}>{t("reassignPorts")}</p>

          <div className="d-flex flex-wrap">
            <Device device={device} />
            <PortColumns
              device={device}
              interfaces={interfaces}
              setInterfaceMode={setInterfaceMode}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Ports;
