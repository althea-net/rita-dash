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
import PriceForm from "./PriceForm";
import QualityForm from "./QualityForm";

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
      <div id="payments-main">
        <h1 id="payments-title">{t("payments")}</h1>

        <Row style={{ marginBottom: 15 }}>
          <Col md="6">
            <PriceForm />
          </Col>
          <Col md="6">
            <QualityForm />
          </Col>
        </Row>

        <Row style={{ opacity: 0.3 }}>
          <Col>
            <Card style={{ height: "100%" }}>
              <CardBody>
                <div className="text-center">
                  <h2>{t("currentBalance")}</h2>
                  <h3>&Xi; {Math.max(0, info.balance)}</h3>
                  <Button color="primary">{t("add1")}</Button>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <LowFunds t={t} />
          </Col>
        </Row>
      </div>
    );
  }
}

function LowFunds({ t }) {
  return (
    <Card>
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

export default connect(["info", "settings"])(translate()(Payments));
