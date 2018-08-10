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
      saved: false,
      saving: false,
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
      saving: false,
      saved: false,
      valid: {
        ...this.state.valid,
        [name]: this.validators[name](value)
      }
    });
  };

  onSubmit = async e => {
    e.preventDefault();

    this.setState({ saving: true });
    await actions.saveWifiSetting(this.state.fields);
    this.setState({ saving: false, saved: true });
  };

  isFieldValid = name =>
    this.state.fields[name] ? this.state.valid[name] : undefined;

  render() {
    return (
      <Card style={{ flex: 1, minWidth: 300, margin: 10 }}>
        <CardBody>
          {this.state.saved && (
            <Alert color="success">Settings Saved Successfully</Alert>
          )}
          {this.state.saving && <Progress animated color="info" value="100" />}
          <Form onSubmit={this.onSubmit}>
            <Label
              for="form"
              style={{
                marginBottom: "20px",
                fontSize: "1.5em",
                textAlign: "center"
              }}
            >
              {this.props.wifiSettings.device.radioType}
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
              <AdvancedSettingsModal
                radio={this.props.wifiSettings.device.radioType}
              />
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
      mesh: false
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
    this.setState({
      mesh: !this.state.mesh
    });

    actions.toggleWifiMesh(this.props.radio);
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

export default connect(["wifiSettings"])(RouterSettings);
