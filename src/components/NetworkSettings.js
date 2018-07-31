import React, { Component } from "react";
import {
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  ListGroup,
  Input,
  ListGroupItemHeading,
  ListGroupItem
} from "reactstrap";
import { actions, connect } from "../store";

const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class NetworkSettings extends Component {
  componentDidMount() {
    this.timer = setInterval(actions.getSettings, 5000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const settings = this.props.state.settings;

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
        {settings ? (
          <ExitSelector exit_client={settings.exit_client} />
        ) : (
          <h5>Exit node selection screen loading...</h5>
        )}
      </div>
    );
  }
}

class NodeInfoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      valid: {}
    };
    this.validators = {
      email: value => !!value.match(email_regex)
    };
  }

  componentDidMount = () => {
    this.setState({ fields: this.props.reg_details });
  };

  onFieldChange = e => {
    const { name, value } = e.target;

    this.setState({
      fields: {
        ...this.state.fields,
        [name]: value
      },
      valid: {
        ...this.state.valid,
        [name]: this.validators[name](value)
      }
    });
  };

  onSubmit = e => {
    e.preventDefault();
    actions.saveRegDetails(this.state.fields);
  };

  isFieldValid = name =>
    this.state.fields[name] ? this.state.valid[name] : undefined;

  render() {
    return (
      <Card>
        <CardBody>
          <Form onSubmit={this.onSubmit}>
            <Label
              for="form"
              style={{
                marginBottom: "20px",
                fontSize: "1.5em",
                textAlign: "center"
              }}
            >
              Node details
            </Label>

            <FormGroup id="form">
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                valid={this.isFieldValid("email")}
                onChange={this.onFieldChange}
                value={this.state.fields.email || ""}
              />
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
                color="primary"
                disabled={!Object.values(this.state.valid).some(t => t)}
                style={{
                  margin: 10
                }}
              >
                Save
              </Button>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

function ExitSelector({ exit_client: { reg_details, current_exit, exits } }) {
  function registered() {
    let r = {};
    Object.keys(exits).forEach(k => {
      if (exits[k]["state"] === "Registered") r[k] = exits[k];
    });
    return r;
  }

  function viable() {
    let r = {};
    Object.keys(exits).forEach(k => {
      if (exits[k]["state"] !== "Registered" && exits[k]["state"] !== "Denied")
        r[k] = exits[k];
    });
    return r;
  }

  function nonviable() {
    let r = {};
    Object.keys(exits).forEach(k => {
      if (exits[k]["state"] === "Denied") r[k] = exits[k];
    });
    return r;
  }

  return (
    <div>
      <NodeInfoForm reg_details={reg_details} />
      <h2 style={{ marginTop: 20 }}>Registered Exits</h2>
      <ExitList
        disabled={!(reg_details.email && reg_details.email.match(email_regex))}
        current_exit={current_exit}
        exits={registered()}
      />
      <h2 style={{ marginTop: 20 }}>Viable Exits</h2>
      <ExitList
        disabled={!(reg_details.email && reg_details.email.match(email_regex))}
        current_exit={current_exit}
        exits={viable()}
      />
      <h2 style={{ marginTop: 20 }}>Non-Viable Exits</h2>
      <ExitList
        disabled={!(reg_details.email && reg_details.email.match(email_regex))}
        current_exit={current_exit}
        exits={nonviable()}
      />
    </div>
  );
}

function ExitList({ current_exit, exits, disabled }) {
  return (
    <ListGroup style={{ position: "relative" }}>
      {Object.entries(exits).map(([nickname, exit], i) => {
        return (
          exit.state !== "Disabled" && (
            <ExitListItem
              active={nickname === current_exit}
              description={exit.message}
              nickname={nickname}
              state={exit.state}
              message={exit.message}
              key={i}
            />
          )
        );
      })}
      {disabled && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(240,240,240,.8)",
            zIndex: 100000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <h5>
            Please enter a valid email address before selecting an exit node.
          </h5>
        </div>
      )}
    </ListGroup>
  );
}

function ExitListItem({ active, description, nickname, state, message }) {
  return (
    <ListGroupItem
      active={active}
      className="list-group-item-action list-group-item-light"
      disabled={state === "Disabled"}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ marginRight: 20, textAlign: "left" }}>
          <ListGroupItemHeading>{nickname}</ListGroupItemHeading>
          {active ? (
            <div>Currently connected</div>
          ) : (
            <div>
              {
                {
                  Registered:
                    "Connection previously accepted" +
                    (message ? " with message: " + message : ""),
                  Denied:
                    "Connection previously denied" +
                    (message ? " with message: " + message : ""),
                  New: "Never connected",
                  Pending: "Connection pending"
                }[state]
              }
            </div>
          )}
        </div>
        <div>
          <div style={{ marginBottom: "30px", minWidth: "80px" }}>
            <abbr title="Tunnel Is Working">
              <i
                style={{ marginLeft: "5px", color: "#80ff80" }}
                className="fa fa-lg fa-signal float-right"
              />
            </abbr>
            <abbr title="Has Route">
              <i
                style={{ marginLeft: "5px", color: "#007bff" }}
                className="fa fa-lg fa-route float-right"
              />
            </abbr>
            <abbr title="Is Reachable">
              <i
                style={{ color: "orange" }}
                className="fa fa-lg fa-bolt float-right"
              />
            </abbr>
          </div>
          {active ||
            state !== "Registered" || (
              <Button
                disabled={state === "Disabled" || state === "Pending"}
                color="primary"
                size="lg"
                onClick={() => {
                  state = "Pending";
                  actions.requestExitConnection(nickname);
                }}
              >
                {state === "Pending" ? "Connecting..." : "Connect"}
                {state === "Pending" && <i className="fa fa-spinner fa-spin" />}
              </Button>
            )}
          {state === "Registered" ||
            state === "Denied" || (
              <Button
                disabled={state === "Disabled" || state === "Pending"}
                color="primary"
                size="lg"
                onClick={() => actions.registerExit(nickname)}
              >
                Register
              </Button>
            )}
        </div>
      </div>
    </ListGroupItem>
  );
}

export default connect(["settings"])(NetworkSettings);
