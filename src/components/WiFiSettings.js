import React, { Component } from "react";
import { getWifiSettings, setWifiSettings } from "../actions";
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

export default class WiFiSettings extends Component {
  componentDidMount() {
    // getWifiSettings(this.props.store);
  }

  setWifiSettings() {
    // setWifiSettings;
  }

  render() {
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
          {this.props.store.state.wifiSettings}
          <WifiSettingsForm deviceName="2.4 GHz" />
          <WifiSettingsForm deviceName="5 GHz" />
        </div>
      </div>
    );
  }
}

function isValid(data, predicate) {
  return data ? predicate : undefined;
}

class WifiSettingsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.validators = {
      ssid: value => value.length >= 8,
      password: value => value.length >= 8
    };
  }

  onFieldChange = e => {
    const { name, value } = e.target;

    this.setState({
      [name]: {
        value,
        valid: this.validators[name](value)
      }
    });
  };

  onSubmit = () => {
    console.log("froop", this.state);
  };

  isFieldValid = name =>
    this.state[name] ? this.state[name].valid : undefined;

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
              {this.props.deviceName}
            </Label>

            <FormGroup id="form">
              <Label for="ssid">SSID</Label>
              <Input
                type="text"
                name="ssid"
                valid={this.isFieldValid("ssid")}
                placeholder="min. 8 characters"
                onChange={this.onFieldChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="text"
                name="password"
                valid={this.isFieldValid("password")}
                placeholder="min. 8 characters"
                onChange={this.onFieldChange}
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
