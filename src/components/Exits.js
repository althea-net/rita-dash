import React, { Component } from "react";
import {
  Button,
  Col,
  ListGroup,
  ListGroupItemHeading,
  ListGroupItem,
  Progress,
  Row
} from "reactstrap";
import { actions, connect } from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Error from "./Error";
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
    const sort = (a, b) =>
      a.nickname.localeCompare(b.nickname, undefined, { sensitivity: "base" });
    exits.sort(sort);

    return (
      <div>
        <Error />
        {loading && <Progress animated color="info" value="100" />}
        {exits.length > 0 && <ExitList exits={exits} />}
      </div>
    );
  }
}

function ExitList({ exits }) {
  let selected;
  function item(exit, i) {
    return <ExitListItem exit={exit} key={i} />;
  }

  let unselected = exits
    .filter(exit => {
      if (exit.isSelected) {
        selected = exit;
        return false;
      }

      if (exit.state === "Disabled" || exit.state === "New") {
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

function ExitListItem({ exit }) {
  let { description, message, state } = exit.exitSettings;
  let { nickname, selected } = exit;
  let connected = exit.isReachable && exit.haveRoute;

  if (exit.exitSettings.state === "Registered")
    connected = exit.isTunnelWorking;

  if (!message) message = "";
  function format(m) {
    if (m.includes("Json") || m.includes("msg:")) {
      return m.match(/.*"(.*)".*/)[1];
    }
    return m;
  }

  return (
    <div>
      <ListGroupItem
        color={
          connected
            ? {
                Registered: "success",
                Denied: "danger",
                New: "info",
                Pending: "info",
                GotInfo: "info"
              }[state]
            : "danger"
        }
        disabled={state === "Disabled"}
      >
        <ListGroupItemHeading>
          <Row>
            <Col xs="6">{nickname}</Col>
            <Col xs="6" className="text-right">
              {connected
                ? {
                    New: "Unregistered",
                    GotInfo: "Unregistered",
                    Pending: "Registering",
                    Registered: "Registered",
                    Denied: "Registration denied"
                  }[state]
                : "Connection problem"}
            </Col>
          </Row>
        </ListGroupItemHeading>
      </ListGroupItem>
      <ListGroupItem
        disabled={state === "Disabled"}
        style={{ marginBottom: "10px" }}
      >
        <Row>
          <Col xs="12" md="8">
            <div>{description}</div>
            {state === "Denied" && <div>{format(message)}</div>}
            <ConnectionError connected={connected} exit={exit} />
          </Col>
          <Col xs="12" md="4">
            {selected ||
              state !== "Registered" || (
                <Button
                  color="success"
                  className="float-md-right"
                  onClick={() => {
                    actions.selectExit(nickname);
                  }}
                >
                  Connect
                </Button>
              )}
            {(state === "GotInfo" || state === "Denied") && (
              <RegistrationForm nickname={nickname} state={state} email="" />
            )}
            {state === "Pending" && (
              <VerifyForm nickname={nickname} state={state} email="" />
            )}
          </Col>
        </Row>
        <Row>
          {state !== "New" && (
            <span
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
              Reset
            </span>
          )}
        </Row>
      </ListGroupItem>
    </div>
  );
}

class ConnectionError extends Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
    this.debug = this.debug.bind(this);
  }

  debug(e) {
    e.preventDefault();
    this.setState({ show: !this.state.show });
  }

  render() {
    let connected = this.props.connected;
    let message =
      this.props.state === "Registered"
        ? "Tunnel connection not working"
        : this.props.exit.haveRoute
          ? "No route to exit"
          : "Exit is not reachable";

    return (
      connected || (
        <div>
          Connection Problem.{" "}
          <a href="#debug" onClick={this.debug}>
            {this.state.show ? "Hide" : "View"} advanced debugging message
          </a>
          {this.state.show && (
            <pre style={{ background: "#ddd", padding: "10px" }}>{message}</pre>
          )}
        </div>
      )
    );
  }
}

export default connect(["exits", "loading"])(Exits);
