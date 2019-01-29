import React, { Component } from "react";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import { actions, connect } from "../store";
import { translate } from "react-i18next";
import PriceForm from "./PriceForm";
import QualityForm from "./QualityForm";
import Error from "./Error";
import Success from "./Success";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import AdvancedSettings from "./AdvancedSettings";
import { BigNumber } from "bignumber.js";

const weiPerEth = BigNumber("1000000000000000000");

class Payments extends Component {
  constructor() {
    super();
    this.state = {
      depositing: false
    };
  }

  componentDidMount() {
    actions.getSettings();
    this.timer = setInterval(actions.getInfo, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const {
      info,
      factorError,
      priceError,
      settings,
      symbol,
      withdrawalSuccess
    } = this.props.state;
    const { t } = this.props;

    let balance = BigNumber(info.balance.toString())
      .div(weiPerEth)
      .toFixed(8);

    if (!(info && settings)) return null;
    return (
      <div id="payments-main">
        <h1 id="payments-title">{t("payments")}</h1>

        <Error error={factorError} />
        <Error error={priceError} />
        <Success message={withdrawalSuccess} />

        <Deposit depositing={this.state.depositing} />
        <Withdraw withdrawing={this.state.withdrawing} />

        <Row style={{ marginBottom: 15 }}>
          <Col md="6">
            <Card style={{ height: "100%" }}>
              <CardBody>
                <div className="text-center">
                  <h2>{t("currentBalance")}</h2>
                  <h3>
                    {balance} {symbol}
                  </h3>
                  <Button color="primary" onClick={actions.startDepositing}>
                    {t("add1")}
                  </Button>
                  <Button
                    className="ml-2"
                    color="primary"
                    onClick={actions.startWithdrawing}
                  >
                    {t("withdraw")}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="6">
            <PriceForm />
          </Col>
        </Row>

        <Row>
          <Col md="6">
            <QualityForm />
          </Col>
          <Col md="6">
            <AdvancedSettings />
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect([
  "factorError",
  "priceError",
  "withdrawalSuccess",
  "info",
  "settings",
  "symbol"
])(translate()(Payments));
