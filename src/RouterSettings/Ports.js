import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Progress } from "reactstrap";
import { get, post, useStore } from "store";

import { Device } from "./PortStyles.js";
import PortColumns from "./PortColumns";
import { Confirm, Error } from "utils";
import useInterval from "hooks/useInterval";

const Ports = () => {
  const [t] = useTranslation();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [portsWaiting, setPortsWaiting] = useState(false);
  const [error, setError] = useState(false);

  const [{ device, interfaces, waiting }, dispatch] = useStore();

  const getInterfaces = async () => {
    try {
      let interfaces = await get("/interfaces", false);
      dispatch({ type: "interfaces", interfaces });
    } catch (e) {
      console.log(e);
    }
  };

  useInterval(() => {
    if (portsWaiting) dispatch({ type: "keepWaiting" });
  }, waiting ? 1000 : null);

  useInterval(getInterfaces, 5000);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    (async () => {
      setLoading(true);
      await getInterfaces();
      setLoading(false);
    })();
    return () => controller.abort();
  }, []); 

  let setInterfaceMode = (iface, mode) => {
    setSelected(iface);
    setMode(mode);
    setOpen(true);
  };

  if (loading || !interfaces) {
    return <Progress animated color="primary" value={100} />;
  }

  let confirm = async () => {
    setError(null);
    setOpen(false);
    let unexpectedError = false;

    try {
      await post("/interfaces", { interface: selected, mode });
    } catch (e) {
      if (e.message.includes("500")) {
        unexpectedError = true;
        setError(t("portToggleError"));
        cancel();
      }
    }

    if (!unexpectedError) {
      setPortsWaiting(true);
      interfaces[selected] = mode;
      dispatch({ type: "startPortChange" });
      dispatch({ type: "startWaiting", waiting: 120 });
      dispatch({ type: "interfaces", interfaces });
    }
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
          <h4>{t("ports")}</h4>

          <p style={{ color: "gray" }}>{t("reassignPorts")}</p>

          <div className="d-flex flex-wrap justify-content-center">
            <Device device={device} />
            <Error error={error} />
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
