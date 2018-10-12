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
import { translate } from "react-i18next";

class Exits extends Component {
  componentDidMount() {
    actions.getExits();
    this.timer = setInterval(actions.getExits, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { exitsError, exits } = this.props.state;
    let { t } = this.props;

    const sort = (a, b) =>
      a.nickname.localeCompare(b.nickname, undefined, { sensitivity: "base" });
    if (exits) exits.sort(sort);

    return (
      <div>
        <Error error={exitsError} />
        {!exits && <Progress animated color="info" value="100" />}
        {exits && <ExitList exits={exits} t={t} />}
      </div>
    );
  }
}

function ExitList({ exits, t }) {
  let selected;
  function item(exit, i) {
    return <ExitListItem exit={exit} key={i} t={t} />;
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
          <h2>{t("selectedExit")}</h2>
          <ListGroup>{item(selected, 0)}</ListGroup>
        </div>
      )}
      <h2>{t("availableExits")}</h2>
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
    let { t } = this.props;
    let id = nickname.toLowerCase().replace(" ", "-");

    if (state === "Registered" && isSelected) {
      connected = exit.isTunnelWorking;
      pseudostate = connected && "Connected";
    }
    if (!message) message = "";
    if (!connected) pseudostate = "Problem";

    if (this.state.registering && state === "GotInfo") {
      pseudostate = "Registering";
    }

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
              <ConnectionError connected={connected} exit={exit} t={t} />
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
                    startRegistering={this.startRegistering}
                    stopRegistering={this.stopRegistering}
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
    let { state } = this.props.exit.exitSettings;
    let reachable = isReachable.toString();
    let route = haveRoute.toString();
    let tunnel = isTunnelWorking.toString();
    let { t } = this.props;

    return (
      connected || (
        <div style={{ marginTop: 5, marginBottom: 5 }}>
          {t("unableToReachExit")}
          <a href="#debug" onClick={this.debug}>
            {t("debuggingMessage", { show: this.state.show ? "Hide" : "View" })}
          </a>
          {this.state.show && (
            <pre style={{ background: "#ddd", padding: "10px" }}>
              {t("debugState", { state })}
              <br />
              {t("debugReachable", { reachable })}
              <br />
              {t("debugRoute", { route })}
              <br />
              {t("debugTunnel", { tunnel })}
            </pre>
          )}
        </div>
      )
    );
  }
}

export default connect(["exits", "exitsError"])(translate()(Exits));
