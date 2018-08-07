import React, { Component } from "react";
import {
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

class NetworkSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    this.timer = setInterval(actions.getExits, 5000);
    await actions.getExits();
    // why doesn't the await above work? this.setState({ loading: false });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const exits = this.props.state.exits;
    const registered = [];
    const unregistered = [];
    const sort = (a, b) =>
      a.nickname.localeCompare(b.nickname, undefined, { sensitivity: "base" });

    Object.keys(exits).forEach(k => {
      if (exits[k]["state"] === "Registered") registered[k] = exits[k];
      else unregistered[k] = exits[k];
    });

    registered.sort(sort);
    unregistered.sort(sort);

    return (
      <div>
        <h1>Network Settings</h1>
        <p>
          Exit nodes are like a combination of a VPN and a speedtest server.
          They keep your browsing history private and make sure that your
          traffic is always routed through the fastest path in the network at a
          given price.
        </p>
        <p>
          Exit nodes need to collect a bit of information about you (your email
          address), and you need to select an exit node in your region. Althea
          runs some exit nodes, but in the future you will be able to select
          exits from other companies if you prefer.
        </p>
        {registered.length > 0 && <ExitList exits={registered} />}
        {unregistered.length > 0 && <ExitList exits={unregistered} />}
        {this.state.loading && <Progress animated color="info" value="100" />}
      </div>
    );
  }
}

function ExitList({ exits }) {
  let selected;
  function item(exit, i) {
    let connected =
      exit.exit_settings.state === "Registered"
        ? exit.is_tunnel_working
        : exit.is_reachable && exit.have_route;

    return (
      <ExitListItem
        connected={connected}
        description={exit.exit_settings.description}
        message={exit.exit_settings.message}
        nickname={exit.nickname}
        selected={exit.is_selected}
        state={exit.exit_settings.state}
        key={i}
      />
    );
  }

  let unselected = exits
    .filter(exit => {
      if (exit.is_selected) {
        selected = exit;
        return false;
      }

      if (exit.exit_settings.state === "Disabled") {
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
  connected,
  description,
  message,
  nickname,
  selected,
  state
}) {
  if (!message) message = "";
  function format(m) {
    if (m.includes("Json")) {
      return m.match(/.*"(.*)".*/)[1];
    }
    return m;
  }

  return (
    <ListGroupItem
      className="list-group-item-action list-group-item-light"
      disabled={state === "Disabled"}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ marginRight: 20, textAlign: "left" }}>
          <ListGroupItemHeading>
            <abbr
              title={connected ? "Connection OK!" : "Connection Problem"}
              style={{ marginRight: "10px" }}
            >
              {connected ? (
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
          <div>
            Status:
            {
              {
                Registered: "Registered",
                Denied: "Connection Denied: " + format(message),
                New: "Not Registered",
                Pending: "Waiting for Verification Code"
              }[state]
            }
          </div>
          {state === "New" || (
            <Button
              color="primary"
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
                disabled={state === "Disabled" || state === "Pending"}
                color="primary"
                size="lg"
                onClick={() => {
                  actions.requestExitConnection(nickname);
                }}
              >
                {state === "Pending" ? "Connecting..." : "Select"}
              </Button>
            )}
          {state === "Registered" ||
            state === "Pending" ||
            state === "Denied" || (
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

export default connect(["exits"])(NetworkSettings);
