import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  ListGroupItem,
  ListGroupItemHeading,
  Row,
  Col
} from "reactstrap";
import RegistrationForm from "./RegistrationForm";
import VerifyForm from "./VerifyForm";
import ConnectionError from "./ConnectionError";
import { actions } from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default ({ exit }) => {
  let [t] = useTranslation();
  let [, setRegistering] = useState(false);

  if (!exit.exitSettings) return null;
  let { description, generalDetails, message, state } = exit.exitSettings;
  let { nickname, isSelected } = exit;
  let { verifMode } = "On";
  let connected = exit.isReachable && exit.haveRoute;
  let pseudostate = state;
  let id = nickname.toLowerCase().replace(" ", "-");

  if (generalDetails) verifMode = generalDetails.verifMode;

  if (state === "Registered" && isSelected) {
    connected = exit.isTunnelWorking;
    pseudostate = connected && "Connected";
  }
  if (!message) message = "";
  if (!connected) pseudostate = "Problem";

  return (
    <div id={id}>
      <ListGroupItem
        color={
          {
            Connected: "success",
            Denied: "danger",
            GotInfo: "info",
            New: "info",
            Pending: "info",
            Problem: "danger",
            Registered: "success",
            Registering: "info"
          }[pseudostate]
        }
        disabled={state === "New" || state === "Disabled"}
      >
        <ListGroupItemHeading>
          <Row>
            <Col xs="6">{nickname}</Col>
            <Col xs="6" className="text-right">
              {
                {
                  New: "",
                  GotInfo: t("stateUnregistered"),
                  Registering: t("stateRegistering"),
                  Pending: t("stateRegistering"),
                  Registered: t("stateRegistered"),
                  Connected: t("stateConnected"),
                  Problem: t("stateProblem"),
                  Denied: t("stateDenied")
                }[pseudostate]
              }
            </Col>
          </Row>
        </ListGroupItemHeading>
      </ListGroupItem>
      <ListGroupItem
        disabled={state === "Disabled"}
        style={{ marginBottom: "10px" }}
      >
        <Row>
          <Col xs="12" md={pseudostate === "Problem" ? 12 : 6}>
            <div>{description}</div>
            {state === "Denied" && <div>{message}</div>}
            <ConnectionError connected={connected} exit={exit} />
          </Col>
          {pseudostate !== "Problem" && (
            <Col xs="12" md="6">
              {!isSelected &&
                state === "Registered" && (
                  <Button
                    color="success"
                    className="float-md-right"
                    onClick={() => {
                      actions.selectExit(nickname);
                    }}
                  >
                    {t("connect")}
                  </Button>
                )}
              {(state === "GotInfo" || state === "Registering") && (
                <RegistrationForm
                  id={id}
                  nickname={nickname}
                  state={state}
                  email=""
                  verifMode={verifMode}
                  startRegistering={() => setRegistering(true)}
                  stopRegistering={() => setRegistering(false)}
                />
              )}
              {state === "Pending" && (
                <VerifyForm
                  id={id}
                  nickname={nickname}
                  state={state}
                  email=""
                />
              )}
            </Col>
          )}
        </Row>
        <Row>
          {state !== "New" && (
            <span
              id={id + "-reset"}
              style={{
                color: "#999",
                cursor: "pointer",
                textDecoration: "underline"
              }}
              onClick={() => {
                actions.resetExit(nickname);
              }}
            >
              <FontAwesomeIcon
                icon="sync"
                color="#aaaaaa"
                style={{
                  marginLeft: "15px",
                  marginTop: "10px",
                  marginRight: "5px"
                }}
              />
              {t("reset")}
            </span>
          )}
        </Row>
      </ListGroupItem>
    </div>
  );
};
