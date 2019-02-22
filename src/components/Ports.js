import React, { useEffect, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Card, CardBody, Progress } from "reactstrap";
import { Context, getState } from "../store";

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

  let confirm = () => {
    setOpen(false);

    actions.startPortChange();
    actions.startWaiting();

    let i = setInterval(async () => {
      actions.keepWaiting();
      if (getState().waiting <= 0) {
        clearInterval(i);
      }
    }, 1000);

    actions.setInterface(confirmIface, mode);
  };

  let cancel = () => setOpen(false);

  return (
    <div>
      <Confirm
        open={open}
        setOpen={setOpen}
        confirm={confirm}
        cancel={cancel}
      />

      <Card>
        <CardBody>
          <h2 style={{ marginTop: 20 }}>{t("ports")}</h2>

          <p style={{ color: "gray", fontSize: 14 }}>{t("reassignPorts")}</p>

          <div className="d-flex flex-wrap justify-content-center">
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
