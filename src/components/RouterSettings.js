import React, { Component } from "react";
import {
  Alert,
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
  Progress
} from "reactstrap";
import { actions, connect } from "../store";

class RouterSettings extends Component {
  async componentDidMount() {
    await actions.getWifiSettings();
  }

  render() {
    const { wifiSettings } = this.props.state;
    return (
      <div>
        <h1>Router Settings</h1>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: 10,
            margin: -20
          }}
        >
          {wifiSettings &&
            wifiSettings.map((settings, i) => (
              <WifiSettingsForm
                state={this.props.state}
                key={i}
                wifiSettings={settings}
              />
            ))}
        </div>
      </div>
    );
  }
}

class WifiSettingsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        key: "",
        ssid: ""
      },
      valid: {}
    };
    this.validators = {
      ssid: value => value.length >= 8,
      key: value => value.length >= 8
    };
  }

  componentDidMount = () => {
    this.setState({ fields: this.props.wifiSettings });
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
    actions.saveWifiSetting(
      this.state.fields,
      this.props.wifiSettings.device.radioType
    );
  };

  isFieldValid = name =>
    this.state.fields[name] ? this.state.valid[name] : undefined;

  render() {
    let radio = this.props.wifiSettings.device.radioType;
    let section = this.props.wifiSettings.device.sectionName;
    let mesh = this.props.wifiSettings.mesh;
    let { loading, success } = this.props.state;

    return (
      <Card style={{ flex: 1, minWidth: 300, margin: 10 }}>
        <CardBody>
          {success === radio && (
            <Alert color="success">Settings Saved Successfully</Alert>
          )}
          {loading === radio && <Progress animated color="info" value="100" />}
          <Form onSubmit={this.onSubmit}>
            <Label
              for="form"
              style={{
                marginBottom: "20px",
                fontSize: "1.5em",
                textAlign: "center"
              }}
            >
              {radio}
            </Label>

            <FormGroup id="form">
              <Label for="ssid">SSID</Label>
              <Input
                type="text"
                name="ssid"
                valid={this.isFieldValid("ssid")}
                placeholder="min. 8 characters"
                onChange={this.onFieldChange}
                value={this.state.fields.ssid}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="text"
                name="key"
                valid={this.isFieldValid("key")}
                placeholder="min. 8 characters"
                onChange={this.onFieldChange}
                value={this.state.fields.key}
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
                style={{
                  margin: 10
                }}
              >
                Save
              </Button>
            </FormGroup>

            <FormGroup
              style={{
                display: "flex",
                margin: -20,
                marginTop: 0,
                padding: 10
              }}
            >
              <AdvancedSettingsModal radio={section} mesh={mesh} />
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

class AdvancedSettingsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      mesh: props.mesh
    };

    this.toggle = this.toggle.bind(this);
    this.onToggleWifiMesh = this.onToggleWifiMesh.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  onToggleWifiMesh() {
    let mesh = !this.state.mesh;
    this.setState({ mesh });
    actions.toggleWifiMesh(this.props.radio, mesh);
  }

  render() {
    return (
      <div>
        <Button
          color="link"
          onClick={this.toggle}
          style={{
            padding: 0,
            margin: 10
          }}
        >
          Advanced Settings
        </Button>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>
            {this.props.radio} WiFi Settings
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      onChange={this.onToggleWifiMesh}
                      value={this.state.mesh}
                      checked={this.state.mesh}
                    />{" "}
                    Enable Mesh Over Wifi
                  </Label>
                </FormGroup>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              style={{
                margin: 10
              }}
              onClick={this.toggle}
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default connect(["loading", "success", "wifiSettings"])(RouterSettings);
