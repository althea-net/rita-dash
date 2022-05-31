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
  const [selected, setSelected] = useState([]);
  const [mode, setMode] = useState([]);
  const [portsWaiting, setPortsWaiting] = useState(false);
  const [error, setError] = useState(false);
  const [wan, setWan] = useState(false);

  const [{ device, interfaces, waiting }, dispatch] = useStore();

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
    setConfirming(true);
  }

  let setInterfaceChanges = (iface, new_mode) => {
    setSelected((selected) => [...selected, iface]);
    if (new_mode === "Wan") {
      setWan(true);
    } else {
      setMode((mode) => [...mode, new_mode]);
    }
  };

  if (!interfaces) {
    return <Progress animated color="primary" value={100} />;
  }

  let confirm = async () => {
    setError(null);
    setConfirming(false);
    let unexpectedError = false;

    // if an interface shows up multiple times in the selected array(e.g. user changed it
    // more than once), take the most recent
    const findDuplicates = (selected) =>
      selected.filter((iface, index) => selected.indexOf(iface) !== index);
    const duplicates = findDuplicates(selected);
    // duplicates holds the names of which show up multiple times in selected
    let selected_cleaned = [];
    let modes_cleaned = [];
    for (var i = 0; i < selected.length; i++) {
      // keep the non duplicates
      if (duplicates.indexOf(selected[i]) === -1) {
        selected_cleaned.push(selected[i]);
        modes_cleaned.push(mode[i]);
      } else if (selected_cleaned.indexOf(selected[i]) === -1) {
        // we must add the last instance of the duplicate
        selected_cleaned.push(selected[selected.lastIndexOf(selected[i])]);
        modes_cleaned.push(mode[selected.lastIndexOf(selected[i])]);
      }
    }
    setSelected(selected_cleaned);
    setMode(modes_cleaned);

    try {
      await post("/interfaces", { interfaces: selected, modes: mode });
    } catch (e) {
      if (e.message.includes("500")) {
        unexpectedError = true;
        setError(t("portToggleError"));
        cancel();
      }
    }

    if (!unexpectedError) {
      setPortsWaiting(true);
      for (var j = 0; j < selected.length; j++) {
        interfaces[selected[j]] = mode[j];
      }
      dispatch({ type: "startPortChange" });
      dispatch({ type: "startWaiting", waiting: 120 });
      dispatch({ type: "interfaces", interfaces });
    }
    setSelected([]);
    setMode([]);
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

      <WANConfig open={wan} setOpen={setWan} setMode={setMode} />

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
              setInterfaceChanges={setInterfaceChanges}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Ports;
