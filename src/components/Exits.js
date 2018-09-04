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
    const { exitsError, exits, loading } = this.props.state;
    const sort = (a, b) =>
      a.nickname.localeCompare(b.nickname, undefined, { sensitivity: "base" });
    exits.sort(sort);

    return (
      <div>
        <Error error={exitsError} />
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
      let { state } = exit.exitSettings;
      if (exit.isSelected && state === "Registered") {
        selected = exit;
        return false;
      }

      if (state === "Disabled" || state === "New") {
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

class ExitListItem extends Component {
  constructor(props) {
    super(props);

    this.state = { registering: false };

    this.startRegistering = this.startRegistering.bind(this);
    this.stopRegistering = this.stopRegistering.bind(this);
  }

  startRegistering() {
    this.setState({ registering: true });
  }

  stopRegistering() {
    this.setState({ registering: false });
  }

  render() {
    let exit = this.props.exit;
    let { description, message, state } = exit.exitSettings;
    let { nickname, isSelected } = exit;
    let connected = exit.isReachable && exit.haveRoute;
    let pseudostate = state;
    if (state === "Registered") {
      connected = exit.isTunnelWorking || !isSelected;
      pseudostate = connected && "Connected";
    }
    if (!message) message = "";
    if (!connected) pseudostate = "Problem";

    if (this.state.registering && state === "GotInfo") {
      pseudostate = "Registering";
    }

    return (
      <div>
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
                    GotInfo: "Unregistered",
                    Registering: "Registering",
                    Pending: "Registering",
                    Registered: "Registered",
                    Connected: "Connected",
                    Problem: "Connection problem",
                    Denied: "Registration denied"
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
                      Connect
                    </Button>
                  )}
                {(state === "GotInfo" || state === "Registering") && (
                  <RegistrationForm
                    nickname={nickname}
                    state={state}
                    email=""
                    startRegistering={this.startRegistering}
                    stopRegistering={this.stopRegistering}
                  />
                )}
                {state === "Pending" && (
                  <VerifyForm nickname={nickname} state={state} email="" />
                )}
              </Col>
            )}
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
    let { isReachable, haveRoute, isTunnelWorking } = this.props.exit;

    return (
      connected || (
        <div style={{ marginTop: 5, marginBottom: 5 }}>
          Unable to reach exit.{" "}
          <a href="#debug" onClick={this.debug}>
            {this.state.show ? "Hide" : "View"} advanced debugging message
          </a>
          {this.state.show && (
            <pre style={{ background: "#ddd", padding: "10px" }}>
              state: {this.props.exit.exitSettings.state}
              <br />
              is_reachable: {isReachable.toString()}
              <br />
              have_route: {haveRoute.toString()}
              <br />
              is_tunnel_working: {isTunnelWorking.toString()}
            </pre>
          )}
        </div>
      )
    );
  }
}

export default connect(["exits", "exitsError", "loading"])(Exits);
