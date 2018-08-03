import React, { Component } from "react";
import {
  Card,
  CardBody,
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  ListGroup,
  Input,
  ListGroupItemHeading,
  ListGroupItem
} from "reactstrap";
import { actions, connect } from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import regex from "./EmailRegex";

class NetworkSettings extends Component {
  componentDidMount() {
    this.timer = setInterval(actions.getExits, 5000);
    actions.getExits();
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const exits = this.props.state.exits;
    const registered = [];
    const unregistered = [];

    Object.keys(exits).forEach(k => {
      if (exits[k]["state"] === "Registered") registered[k] = exits[k];
      else unregistered[k] = exits[k];
    });

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
      </div>
    );
  }
}

class NodeInfoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blurred: false,
      fields: {
        email: ""
      },
      valid: {}
    };
    this.validators = {
      email: value => !!value.match(regex)
    };
  }

  componentDidMount = () => {
    this.setState({
      fields: {
        email: this.props.email
      }
    });
  };

  onFieldChange = e => {
    const { name, value } = e.target;

    this.setState({
      blurred: false,
      fields: {
        ...this.state.fields,
        [name]: value
      },
      valid: {
        ...this.state.valid,
        [name]: true
      }
    });
  };

  onBlur = e => {
    const { name, value } = e.target;

    this.setState({
      blurred: true,
      valid: {
        ...this.state.valid,
        [name]: this.validators[name](value)
      }
    });
  };

  onSubmit = e => {
    e.preventDefault();
    actions.registerExit(this.state.fields.email);
  };

  isFieldValid = name =>
    this.state.fields[name] ? this.state.valid[name] : undefined;

  render() {
    return (
      <Card>
        <CardBody>
          <Form onSubmit={this.onSubmit}>
            <FormGroup id="form">
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                valid={this.isFieldValid("email") && this.state.blurred}
                invalid={this.state.fields.email && !this.isFieldValid("email")}
                onChange={this.onFieldChange}
                onBlur={this.onBlur}
                value={this.state.fields.email || ""}
              />
              <FormFeedback invalid>A valid email is required</FormFeedback>
            </FormGroup>

            <FormGroup
              style={{
                display: "flex",
                margin: -20,
                marginTop: 0,
                padding: 10
              }}
            >
              <Button
                color={this.isFieldValid("email") ? "primary" : "secondary"}
                disabled={!this.isFieldValid("email")}
                style={{
                  margin: 10
                }}
              >
                Register
              </Button>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

function ExitList({ exits }) {
  return (
    <ListGroup style={{ position: "relative" }}>
      {exits.map((exit, i) => {
        let connected =
          exit.exit_settings.state === "Registered"
            ? exit.is_tunnel_working
            : exit.is_reachable && exit.have_route;
        return (
          exit.state !== "Disabled" && (
            <ExitListItem
              active={exit.is_selected}
              connected={connected}
              description={exit.exit_settings.description}
              message={exit.exit_settings.message}
              nickname={exit.nickname}
              state={exit.exit_settings.state}
              key={i}
            />
          )
        );
      })}
    </ListGroup>
  );
}

function ExitListItem({
  active,
  connected,
  description,
  message,
  nickname,
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
      active={active}
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
          {active ? (
            <div>Currently connected</div>
          ) : (
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
          )}
        </div>
        <div>
          {active ||
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
            state === "Denied" || <NodeInfoForm email="" />}
        </div>
      </div>
    </ListGroupItem>
  );
}

export default connect(["exits"])(NetworkSettings);
