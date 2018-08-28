import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Row
} from "reactstrap";

import { actions, connect } from "../store";

class Payments extends Component {
  componentDidMount() {
    actions.getInfo();
    actions.getSettings();
  }

  render() {
    const { info, settings } = this.props.state;
    if (!(info && settings)) return null;
    return (
      <div>
        <h1>Payments</h1>
        <div className="text-center">
          <h2>Current Balance:</h2>
          <h3>&Xi; {Math.max(0, info.balance)}</h3>
          <Button color="primary">Add &Xi;1 to balance</Button>
        </div>

        <Row style={{ opacity: 0.3 }}>
          <Col md="6">
            <LowFunds />
          </Col>
          <Col md="6">
            <PriceQuality />
          </Col>
        </Row>
      </div>
    );
  }
}

function LowFunds() {
  return (
    <Card style={{ flex: 1, minWidth: 300, maxWidth: 400, margin: 10 }}>
      <CardBody>
        <h3>When funds get low:</h3>

        <Form>
          <FormGroup>
            <Label for="exampleEmail">Threshold</Label>
            <InputGroup>
              <Input style={{ width: "5em" }} type="number" value="10" />
              <InputGroupAddon addonType="append">
                % of average monthly use
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>

          {/* <FormGroup check style={{ marginBottom: ".5rem" }}>
          <Label check>
            <Input type="checkbox" /> Send an email to this address:
          </Label>
          </FormGroup>

          <FormGroup>
            <Input type="email" name="email" id="exampleEmail" />
          </FormGroup> */}

          <FormGroup check>
            <Label check>
              <Input type="checkbox" /> Throttle speed
            </Label>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
}

function PriceQuality() {
  return (
    <Card style={{ flex: 1, minWidth: 300, maxWidth: 400, margin: 10 }}>
      <CardBody>
        <h3>Price/Quality tradeoff:</h3>

        <Form>
          <FormGroup>
            <Input type="range" />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <small>Prefer low price</small>
              <small>Prefer high quality</small>
            </div>
          </FormGroup>

          <FormGroup>
            <Label for="exampleEmail">Highest acceptable price</Label>
            <InputGroup>
              <Input type="number" value="10" />
              <InputGroupAddon addonType="append">cents/GB</InputGroupAddon>
            </InputGroup>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
}

export default connect(["settings", "info"])(Payments);
