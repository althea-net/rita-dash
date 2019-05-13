import React, { useEffect, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Progress } from "reactstrap";
import { get, useStateValue } from "store";
import AppContext from "store/App";

import { Device } from "./PortStyles.js";
import PortColumns from "./PortColumns";
import { Confirm } from "utils";
import useInterval from "utils/UseInterval";

const Ports = () => {
  const [t] = useTranslation();
  const [open, setOpen] = useState(false);
  const [confirmIface, setConfirmIface] = useState("");
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(false);

  const [{ interfaces, waiting }, dispatch] = useStateValue();

  useInterval(() => {
    dispatch({ type: "keepWaiting" });
  }, waiting ? 1000 : null);

  const {
    info: { device }
  } = useContext(AppContext);

  useEffect(
    () => {
      const getInterfaces = async () => {
        setLoading(true);

        try {
          let interfaces = await get("/interfaces", false);
          dispatch({ type: "setInterfaces", interfaces });
        } catch (e) {
          console.log(e);
        }

        setLoading(false);
      };

      getInterfaces();
    },
    [dispatch]
  );

  let setInterfaceMode = (iface, mode) => {
    setConfirmIface(iface);
    setMode(mode);
    setOpen(true);
  };

  if (loading || !interfaces) {
    return <Progress animated color="info" value={100} />;
  }

  let confirm = () => {
    setOpen(false);
    dispatch({ type: "startPortChange" });
    dispatch({ type: "startWaiting" });
    dispatch({ type: "setInterface", confirmIface, mode });
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
