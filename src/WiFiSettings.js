import React, { Component } from "react";
import { Col, Button, Form, FormGroup, Label, Input } from "reactstrap";

export default class WiFiSettings extends Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap"
        }}
      >
        <div
          style={{
            height: "auto",
            width: "auto",
            margin: "5%",
            padding: "5%",
            borderStyle: "solid"
          }}
        >
          <CreateLoginForm network="2.4 GHz" />
        </div>
        <div
          style={{
            height: "auto",
            width: "auto",
            margin: "5%",
            padding: "5%",
            borderStyle: "solid"
          }}
        >
          <CreateLoginForm network="5 GHz" />
        </div>
      </div>
    );
  }
}

function CreateLoginForm({ network }) {
  return (
    <Form>
      <Label
        for="form"
        style={{
          height: "100%",
          width: "100%",
          marginBottom: "20px",
          fontSize: "1.5em",
          textAlign: "center"
        }}
      >
        {network}
      </Label>

      <FormGroup id="form" row>
        <Label for="form-input" sm={2}>
          SSID
        </Label>

        <Col sm={8}>
          <Input
            type="text"
            name="form-input"
            id="form-input"
            placeholder="min. 8 characters"
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="password-input" sm={2}>
          Password
        </Label>
        <Col sm={8}>
          <Input
            type="password"
            name="password-input"
            id="password-input"
            placeholder="min. 8 characters"
          />
        </Col>
      </FormGroup>
      <FormGroup check>
        <Label check>
          <Input type="checkbox" />
          Connect to a mesh
        </Label>
      </FormGroup>

      <FormGroup
        style={{
          display: "flex",
          marginTop: "20px",
          justifyContent: "flex-end"
        }}
      >
        <Button
          style={{
            width: "80px",
            marginRight: "20px"
          }}
        >
          Revert
        </Button>
        <Button
          style={{
            width: "80px"
          }}
        >
          Save
        </Button>
      </FormGroup>
    </Form>
  );
}
