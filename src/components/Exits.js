import React, { Component } from "react";
import {
  Alert,
  Button,
  ListGroup,
  ListGroupItemHeading,
  ListGroupItem,
  Progress
} from "reactstrap";
import { actions, connect } from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RegistrationForm from "./RegistrationForm";
import VerifyForm from "./VerifyForm";

class Exits extends Component {
  componentDidMount() {
    actions.getExits();
    this.timer = setInterval(actions.getExits, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { exits, loading } = this.props.state;
    const registered = [];
    const unregistered = [];
    const sort = (a, b) =>
      a.nickname.localeCompare(b.nickname, undefined, { sensitivity: "base" });

    if (exits && exits.length) {
      Object.keys(exits).forEach(k => {
        if (exits[k]["exitSettings"]["state"] === "Registered")
          registered[k] = exits[k];
        else unregistered[k] = exits[k];
      });

      registered.sort(sort);
      unregistered.sort(sort);
    }

    return (
      <div>
        <Error />
        {loading && <Progress animated color="info" value="100" />}
        {registered.length > 0 && <ExitList exits={registered} />}
        {unregistered.length > 0 && <ExitList exits={unregistered} />}
      </div>
    );
  }
}

function ExitList({ exits }) {
  let selected;
  function item(exit, i) {
    let connection = "";
    if (exit.exitSettings.state === "Registered")
      connection = exit.isTunnelWorking
        ? "Connection OK!"
        : "Tunnel connection not working";
    else {
      if (!exit.isReachable) connection += "Exit is not reachable. ";
      if (!exit.haveRoute) connection += "No route to exit.";
      if (!connection) connection = "Connection OK!";
    }

    return (
      <ExitListItem
        connection={connection}
        description={exit.exitSettings.description}
        message={exit.exitSettings.message}
        nickname={exit.nickname}
        selected={exit.isSelected}
        state={exit.exitSettings.state}
        key={i}
      />
    );
  }

  let unselected = exits
    .filter(exit => {
      if (exit.isSelected) {
        selected = exit;
        return false;
      }

      if (exit.state === "Disabled") {
        return false;
      }

      return true;
    })
    .map((exit, i) => item(exit, i));

  return (
    <div>
      {selected && (
        <div>
          <h2>Selected Exit</h2>
          <ListGroup>{item(selected, 0)}</ListGroup>
        </div>
      )}
      <h2>Available Exits</h2>
      <ListGroup>{unselected}</ListGroup>
    </div>
  );
}

function ExitListItem({
  connection,
  description,
  message,
  nickname,
  selected,
  state
}) {
  if (!message) message = "";
  function format(m) {
    if (m.includes("Json") || m.includes("msg:")) {
      return m.match(/.*"(.*)".*/)[1];
    }
    return m;
  }

  return (
    <ListGroupItem disabled={state === "Disabled"}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ marginRight: 20, textAlign: "left" }}>
          <ListGroupItemHeading>
            <abbr title={connection} style={{ marginRight: "10px" }}>
              {connection === "Connection OK!" ? (
                <FontAwesomeIcon icon="signal" color="#80ff80" />
              ) : (
                <span className="fa-layers fa-fw">
                  <FontAwesomeIcon icon="signal" color="black" />
                  <FontAwesomeIcon icon="ban" color="red" size="lg" />
                </span>
              )}
            </abbr>
            {nickname}
          </ListGroupItemHeading>
          <div>{description}</div>
          <div>
            Status:&nbsp;
            {
              {
                Registered: "Registered",
                Denied: "Connection Denied: " + format(message),
                New: "Never Contacted",
                Pending: "Pending, Waiting for Verification Code",
                GotInfo: "Contacted but Not Registered"
              }[state]
            }
          </div>
          {state !== "New" && (
            <Button
              color="dark"
              onClick={() => {
                actions.resetExit(nickname);
              }}
            >
              Reset
            </Button>
          )}
        </div>
        <div>
          {selected ||
            state !== "Registered" || (
              <Button
                color="dark"
                onClick={() => {
                  actions.selectExit(nickname);
                }}
              >
                Select
              </Button>
            )}
          {(state === "GotInfo" || state === "Denied") && (
            <RegistrationForm nickname={nickname} state={state} email="" />
          )}
          {state === "Pending" && (
            <VerifyForm nickname={nickname} state={state} email="" />
          )}
        </div>
      </div>
    </ListGroupItem>
  );
}

const Error = connect(["error"])(({ state }) => {
  if (!state.error) return null;
  return <Alert color="danger">{state.error}</Alert>;
});

export default connect(["exits", "loading"])(Exits);
