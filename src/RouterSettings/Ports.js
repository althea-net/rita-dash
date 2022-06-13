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
  const [wanMode, setWanMode] = useState(null);
  const [portsWaiting, setPortsWaiting] = useState(false);
  const [error, setError] = useState(false);
  const [wan, setWan] = useState(false);

  const [{ device, interfaces, waiting }, dispatch] = useStore();

  const [interfaces_state, setInterfaces] = useState(null);
  const interfaces_local =
    interfaces_state != null ? interfaces_state : interfaces;

  const getInterfaces = async (signal) => {
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

  function setInterfaceMode() {
    // wanMode is now used to check and set if a wan port has been assigned
    // as it carries over the value (either Wan or StaticWan config) from WANConfig popup
    if (wanMode !== null) {
      let new_interfaces = interfaces_local;
      for (let iface in new_interfaces) {
        if (new_interfaces[iface] === "Wan") {
          // if StaticWan has been set, this is where we actually handle adding it to the
          // info sent to the backend
          new_interfaces[iface] = wanMode;
          setInterfaces(new_interfaces);
          dispatch({ type: "interfaces", interfaces: new_interfaces });
        }
      }
    }
    setConfirming(true);
  }

  let setInterfaceChanges = (iface, new_mode) => {
    if (new_mode === "Wan") {
      setWan(true);
    }

    // create a new interfaces array (to trigger a react rerender) and update it
    let new_interfaces = interfaces_local;
    new_interfaces[iface] = new_mode;

    // set it to local state (overrides store)
    setInterfaces(new_interfaces);
    // save it to the store
    dispatch({ type: "interfaces", interfaces: new_interfaces });
  };

  if (!interfaces) {
    return <Progress animated color="primary" value={100} />;
  }

  let confirm = async () => {
    setError(null);
    setConfirming(false);
    let unexpectedError = false;

    let selected = [];
    let modes = [];
    for (var n in interfaces_local) {
      selected.push(n);
      modes.push(interfaces_local[n]);
    }

    try {
      await post("/interfaces", { interfaces: selected, modes: modes });
    } catch (e) {
      if (e.message.includes("500")) {
        unexpectedError = true;
        setError(t("portToggleError"));
        cancel();
      }
    }

    if (!unexpectedError) {
      setPortsWaiting(true);
      dispatch({ type: "startPortChange" });
      dispatch({ type: "startWaiting", waiting: 120 });
      dispatch({ type: "interfaces", interfaces });
    }
    setWanMode(null);
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

      <WANConfig open={wan} setOpen={setWan} setWanMode={setWanMode} />

      <Card>
        <CardBody>
          <h4>{t("ports")}</h4>

          <p style={{ color: "gray" }}>{t("reassignPorts")}</p>

          <div className="d-flex flex-wrap justify-content-center">
            <Device device={device} />
            <Error error={error} />
            <PortColumns
              device={device}
              interfaces={interfaces_local}
              setInterfaceMode={setInterfaceMode}
              setInterfaceChanges={setInterfaceChanges}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Ports;
