import React, { Component } from "react";
import {
  Col,
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { actions, connect } from "../store";

class WifiSettings extends Component {
  componentDidMount() {
    actions.getWifiSettings();
  }

  render() {
    const { wifiSettings } = this.props.state;
    return (
      <div>
        <h1>WiFi Settings</h1>
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
                store={this.props.store}
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
      fields: {},
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
    actions.saveWifiSetting(this.state.fields);
  };

  isFieldValid = name =>
    this.state.fields[name] ? this.state.valid[name] : undefined;

  render() {
    return (
      <Card style={{ flex: 1, minWidth: 300, margin: 10 }}>
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
              {this.state.fields.device_name}
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
              <Button
                color="primary"
                style={{
                  margin: 10
                }}
              >
                Revert
              </Button>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

export default connect(["wifiSettings"])(WifiSettings);
