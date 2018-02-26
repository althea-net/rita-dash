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

export default class WiFiSettings extends Component {
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
          <LoginForm network="2.4 GHz" />
          <LoginForm network="5 GHz" />
        </div>
      </div>
    );
  }
}

function LoginForm({ network }) {
  return (
    <Card style={{ flex: 1, minWidth: 300, margin: 10 }}>
      <CardBody>
        <Form>
          <Label
            for="form"
            style={{
              marginBottom: "20px",
              fontSize: "1.5em",
              textAlign: "center"
            }}
          >
            {network}
          </Label>

          <FormGroup id="form">
            <Label for="form-input">SSID</Label>
            <Input
              type="text"
              name="form-input"
              id="form-input"
              placeholder="min. 8 characters"
            />
          </FormGroup>
          <FormGroup>
            <Label for="password-input">Password</Label>
            <Input
              type="password"
              name="password-input"
              id="password-input"
              placeholder="min. 8 characters"
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
