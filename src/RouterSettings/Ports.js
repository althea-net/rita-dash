import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Progress } from "reactstrap";
import { get, post, useStore } from "store";
import { Confirm, Error } from "utils";
import useInterval from "hooks/useInterval";

import { Device } from "./PortStyles";
import PortColumns from "./PortColumns";
import WANConfig from "./WANConfig";

const Ports = () => {
  const [t] = useTranslation();
  const [confirming, setConfirming] = useState(false);
  const [selected, setSelected] = useState("");
  const [mode, setMode] = useState("");
  const [portsWaiting, setPortsWaiting] = useState(false);
  const [error, setError] = useState(false);
  const [wan, setWan] = useState(false);

  const [{ device, interfaces, waiting }, dispatch] = useStore();

  const getInterfaces = async signal => {
    if (!signal) {
      const controller = new AbortController();
      signal = controller.signal;
    }

    try {
      let interfaces = await get("/interfaces", false, 5000, signal);

      dispatch({ type: "interfaces", interfaces });
    } catch (e) {
      console.log(e);
    }
  };

  useInterval(
    () => {
      if (portsWaiting) dispatch({ type: "keepWaiting" });
    },
    waiting ? 1000 : null
  );

  useInterval(getInterfaces, 5000);

  let setInterfaceMode = (iface, mode) => {
    setSelected(iface);
    if (mode === "Wan") {
      setWan(true);
    } else {
      setMode(mode);
      setConfirming(true);
    }
  };

  if (!interfaces) {
    return <Progress animated color="primary" value={100} />;
  }

  let confirm = async () => {
    setError(null);
    setConfirming(false);
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

  let cancel = () => setConfirming(false);

  return (
    <div>
      <Confirm
        open={confirming}
        setOpen={setConfirming}
        confirm={confirm}
        cancel={cancel}
      />

      <WANConfig
        open={wan}
        setOpen={setWan}
        setMode={setMode}
        setConfirming={setConfirming}
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
