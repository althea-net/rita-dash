import React, { useEffect, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, Card, CardBody, Progress } from "reactstrap";
import { Context, getState } from "../store";
import styled from "styled-components";

import portImage from "../images/port.png";
import glImage from "../images/gl.jpg";
import portOrderings from "../portOrderings";
import Confirm from "./Confirm";

const GL = () => {
  return (
    <img
      src={glImage}
      alt="GL B-1300"
      className="img-fluid"
      style={{ marginBottom: 20, width: 300, marginRight: 40 }}
    />
  );
};

const deviceImages = {
  "gl-b1300": <GL />
};

const portStyle = {
  position: "absolute",
  top: 30,
  left: 62,
  fontSize: 24,
  fontWeight: "bold",
  textShadow: "2px 2px #666",
  textAlign: "center",
  color: "white",
  height: 40,
  paddingTop: 4
};

const PortToggle = styled(Button)`
  width: 100px;
  background: ${props => (props.selected ? "#0BB36D" : "white")} !important;
  color: ${props => (props.selected ? "white" : "gray")} !important;
  border: 1px solid #aaa;
  border-color: ${props => (props.selected ? "#0BB36D" : "#aaa")} !important;
  border-radius: 0;
  margin-top: 6px;
`;

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
  };

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

  let { device } = info;
  let modes = [t("LAN"), t("Mesh"), t("WAN")];

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
      <Confirm
        show={open}
        t={t}
        cancel={() => setOpen(false)}
        confirm={confirm}
      />

      <Card>
        <CardBody>
          <h2 style={{ marginTop: 20 }}>{t("ports")}</h2>
          <p style={{ color: "gray", fontSize: 14 }}>{t("reassignPorts")}</p>
          <div className="d-flex flex-wrap">
            <div className="text-center">{deviceImages[device]}</div>
            <div
              className="d-flex flex-nowrap justify-content-center"
              style={{ marginBottom: 20 }}
            >
              {portOrderings[device].map((iface, i) => {
                return (
                  <Card
                    key={i}
                    style={{
                      borderRadius: 0,
                      borderLeft:
                        i === portOrderings[device].length - 1 && "none",
                      borderRight: i === 0 && "none"
                    }}
                  >
                    <CardBody className="text-center">
                      <img src={portImage} alt={iface} width="60px" />

                      <div style={portStyle}>{iface}</div>

                      <div className="d-flex flex-column mt-3">
                        {modes.map((mode, i) => {
                          return (
                            <PortToggle
                              key={i}
                              selected={mode === interfaces[iface]}
                              onClick={() => setInterfaceMode(iface, mode)}
                            >
                              {mode}
                            </PortToggle>
                          );
                        })}
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Ports;
