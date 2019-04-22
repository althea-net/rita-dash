import React, { useEffect, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Progress } from "reactstrap";
import { actions, get, getState } from "store";
import AppContext from "store/App";

import { Device } from "./PortStyles.js";
import PortColumns from "./PortColumns";
import { Confirm } from "utils";

const Ports = () => {
  const [t] = useTranslation();
  const [open, setOpen] = useState(false);
  const [confirmIface, setConfirmIface] = useState("");
  const [mode, setMode] = useState("");
  const [interfaces, setInterfaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    info: { device }
  } = useContext(AppContext);

  const getInterfaces = async () => {
    setLoading(true);

    let res = await get("/interfaces", false);

    /*eslint no-sequences: 0*/
    setInterfaces(
      Object.keys(res)
        .filter(i => !i.startsWith("wlan"))
        .reduce((a, b) => ((a[b] = res[b]), a), {})
    );

    setLoading(false);
  };

  useEffect(() => {
    getInterfaces();
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

  if (loading) {
    return <Progress animated color="info" value={100} />;
  }

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
