import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Progress } from "reactstrap";
import { get, post, useStore } from "store";

import { Device } from "./PortStyles.js";
import PortColumns from "./PortColumns";
import { Confirm } from "utils";
import useInterval from "hooks/useInterval";

const Ports = () => {
  const [t] = useTranslation();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [portsWaiting, setPortsWaiting] = useState(false);

  const [{ device, interfaces, waiting }, dispatch] = useStore();

  useInterval(() => {
    if (portsWaiting) dispatch({ type: "keepWaiting" });
  }, waiting ? 1000 : null);

  useEffect(
    () => {
      const getInterfaces = async () => {
        setLoading(true);

        try {
          let interfaces = await get("/interfaces", false);
          dispatch({ type: "interfaces", interfaces });
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
    setSelected(iface);
    setMode(mode);
    setOpen(true);
  };

  if (loading || !interfaces) {
    return <Progress animated color="info" value={100} />;
  }

  let confirm = async () => {
    setOpen(false);
    setPortsWaiting(true);
    dispatch({ type: "startPortChange" });
    dispatch({ type: "startWaiting", waiting: 120 });

    interfaces[selected] = mode;
    dispatch({ type: "interfaces", interfaces });

    try {
      await post("/interfaces", { interface: selected, mode });
    } catch {}
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
