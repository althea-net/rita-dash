import React, { Component } from "react";
import {
  Col,
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItemHeading,
  ListGroupItem,
  CardTitle
} from "reactstrap";
import { actions, connect } from "../store";
import { relative } from "path";

const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const exit_client = {
  exit_client: {
    current_exit: "exit_a",
    exits: {
      exit_a: {
        general_details: {
          description: "just a normal althea exit",
          eth_address: "0x0101010101010101010101010101010101010101",
          exit_price: 50,
          netmask: 24,
          server_internal_ip: "172.168.1.254",
          wg_exit_port: 59999,
          wg_public_key: "OBQNe50O7Gf+pJq4ZC1tTcjVYbx7o8jt4dxTFw7QnVw="
        },
        ip: "fd00::5",
        message: "Registration OK",
        our_details: { client_internal_ip: "172.168.1.101" },
        registration_port: 4875,
        state: "Registered"
      }
    },
    reg_details: { email: "1234@gmail.com", zip_code: "1234" },
    wg_listen_port: 59999
  },
  exit_tunnel_settings: { lan_nics: ["lo"] },
  network: {
    babel_port: 6872,
    bounty_ip: "fd00::3",
    bounty_port: 8888,
    default_route: [],
    manual_peers: [],
    own_ip: "fd00::1",
    peer_interfaces: ["veth-1-6"],
    rita_dashboard_port: 4877,
    rita_hello_port: 4876,
    wg_private_key: "AKlrbUt13OPYp6+cy9lllQ47KCdM2+3+y7q3OqsTd2Q=",
    wg_private_key_path:
      "/home/ben/src/althea_rs/integration-tests/private-key-1",
    wg_public_key: "QEKhgUJ7VnjPnEJ2eLYaLu4RMDhQmylN1dNHQHth+Uw=",
    wg_start_port: 60000
  },
  payment: {
    buffer_period: 3,
    close_fraction: "100",
    close_threshold: "-1000000000",
    eth_address: "0x0101010101010101010101010101010101010101",
    pay_threshold: "0"
  }
};

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
  return (
    <div>
      <NodeInfoForm reg_details={reg_details} />
      <h2 style={{ marginTop: 20 }}>Select exit</h2>
      <ExitList
        disabled={!(reg_details.email && reg_details.email.match(email_regex))}
        current_exit={current_exit}
        exits={exits}
      />
    </div>
  );
}

function ExitList({ current_exit, exits, disabled }) {
  return (
    <ListGroup style={{ position: "relative" }}>
      {exits[current_exit] && (
        <ExitListItem
          active={true}
          description={exits[current_exit].message}
          nickname={current_exit}
          state={exits[current_exit].statex}
          message={exits[current_exit].message}
          key={"foo"}
        />
      )}
      {Object.entries(exits).map(([nickname, exit], i) => {
        return (
          nickname !== current_exit &&
          exit.state !== "Disabled" && (
            <ExitListItem
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
      color={
        {
          Registered: "success",
          Denied: "danger"
        }[state]
      }
      disabled={state === "Disabled"}
      active={active}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <div style={{ marginRight: 20, textAlign: "left" }}>
          <ListGroupItemHeading>{nickname}</ListGroupItemHeading>
          <div>{description}</div>
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

        {active ? (
          <div />
        ) : (
          <div>
            <Button
              disabled={state === "Disabled" || state === "Pending"}
              color="primary"
              size="lg"
              onClick={() => actions.requestExitConnection(nickname)}
            >
              {state === "Pending" ? "Connecting..." : "Connect"}
            </Button>
          </div>
        )}
      </div>
    </ListGroupItem>
  );
}

export default connect(["settings"])(NetworkSettings);
