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
import { translate } from "react-i18next";

class Payments extends Component {
  componentDidMount() {
    actions.getInfo();
    actions.getSettings();
  }

  render() {
    const { info, settings } = this.props.state;
    const { t } = this.props;

    if (!(info && settings)) return null;
    return (
      <div>
        <h1>{t("payments")}</h1>
        <div className="text-center">
          <h2>{t("currentBalance")}</h2>
          <h3>&Xi; {Math.max(0, info.balance)}</h3>
          <Button color="primary">{t("add1")}</Button>
        </div>

        <Row style={{ opacity: 0.3 }}>
          <Col md="6">
            <LowFunds t={t} />
          </Col>
          <Col md="6">
            <PriceQuality t={t} />
          </Col>
        </Row>
      </div>
    );
  }
}

function LowFunds({ t }) {
  return (
    <Card style={{ flex: 1, minWidth: 300, maxWidth: 400, margin: 10 }}>
      <CardBody>
        <h3>{t("lowFunds")}</h3>

        <Form>
          <FormGroup>
            <Label for="exampleEmail">{t("threshold")}</Label>
            <InputGroup>
              <Input
                style={{ width: "5em" }}
                type="number"
                value="10"
                readOnly
              />
              <InputGroupAddon addonType="append">
                {t("monthlyUse")}
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>

          <FormGroup check>
            <Label check>
              <Input type="checkbox" /> {t("throttleSpeed")}
            </Label>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
}

function PriceQuality({ t }) {
  return (
    <Card style={{ flex: 1, minWidth: 300, maxWidth: 400, margin: 10 }}>
      <CardBody>
        <h3>{t("priceQuality")}</h3>

        <Form>
          <FormGroup>
            <Input type="range" />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <small>{t("preferLow")}</small>
              <small>{t("preferHigh")}</small>
            </div>
          </FormGroup>

          <FormGroup>
            <Label for="exampleEmail">{t("highestAcceptable")}</Label>
            <InputGroup>
              <Input type="number" value="10" readOnly />
              <InputGroupAddon addonType="append">
                {t("weiPerGB")}
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
}

export default connect(["settings", "info"])(translate()(Payments));
