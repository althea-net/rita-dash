import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import { actions, connect } from "../store";
import { translate } from "react-i18next";
import { BigNumber } from "bignumber.js";
import web3 from "web3";
import Error from "./Error";

const weiPerEth = BigNumber("1000000000000000000");

class Withdraw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blurred: false,
      fields: {
        address: "",
        amount: ""
      },
      valid: {}
    };
    this.validators = {
      address: a => web3.utils.isAddress(a),
      amount: a => !isNaN(a) && a > 0 && a <= this.props.state.info.balance
    };
  }

  componentDidMount = () => {
    this.setState({
      fields: {
        address: this.props.address,
        amount: this.props.amount
      }
    });
  };

  onFieldChange = e => {
    const { name, value } = e.target;

    this.setState({
      blurred: false,
      fields: {
        ...this.state.fields,
        [name]: value
      },
      valid: {
        ...this.state.valid,
        [name]: true
      }
    });
  };

  onBlur = e => {
    const { name, value } = e.target;

    this.setState({
      blurred: true,
      valid: {
        ...this.state.valid,
        [name]: this.validators[name](value)
      }
    });
  };

  isFieldValid = name =>
    this.state.fields[name] ? this.state.valid[name] : false;

  allValid = () => {
    let valid = true;
    for (let f in this.state.fields) {
      valid = valid && this.validators[f](this.state.fields[f]);
    }
    return valid;
  };

  onSubmit = async e => {
    e.preventDefault();
    let { address, amount } = this.state.fields;

    if (!this.allValid()) return;

    amount = BigNumber(amount.toString())
      .times(weiPerEth)
      .toString();

    actions.withdraw(address, amount);
  };

  render() {
    let { info, symbol, withdrawing, withdrawalError } = this.props.state;
    let { balance } = info;
    let { t } = this.props;

    balance = BigNumber(balance.toString())
      .div(weiPerEth)
      .toFixed(8);

    return (
      <div>
        <Modal isOpen={withdrawing}>
          <ModalHeader>{t("withdraw")}</ModalHeader>
          <ModalBody>
            <Card>
              <CardBody className="text-center">
                <Error error={withdrawalError} />
                <h2>
                  <span>{t("currentBalance")} </span>
                  <span>
                    {balance} {symbol}
                  </span>
                </h2>
                <Form onSubmit={this.onSubmit} className="text-left">
                  <FormGroup id="form">
                    <Label for="address" style={{ marginRight: 5 }}>
                      <b>{t("address")}</b>
                    </Label>
                    <Input
                      id={"address"}
                      label={t("to")}
                      type="text"
                      name="address"
                      placeholder={t("enterEthAddress")}
                      valid={this.isFieldValid("address") && this.state.blurred}
                      invalid={
                        !(
                          this.isFieldValid("address") ||
                          !this.state.fields.address
                        )
                      }
                      onChange={this.onFieldChange}
                      onBlur={this.onBlur}
                      value={this.state.fields.address || ""}
                    />
                    <FormFeedback invalid="true">
                      {t("addressRequired")}
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup id="form">
                    <Label for="amount" style={{ marginRight: 5 }}>
                      <b>{t("amount")}</b>
                    </Label>
                    <Input
                      id={"amount"}
                      label={t("to")}
                      type="text"
                      name="amount"
                      placeholder={t("enterAmount")}
                      valid={this.isFieldValid("amount") && this.state.blurred}
                      invalid={
                        !(
                          this.isFieldValid("amount") ||
                          !this.state.fields.amount
                        )
                      }
                      onChange={this.onFieldChange}
                      onBlur={this.onBlur}
                      value={this.state.fields.amount || ""}
                    />
                    <FormFeedback invalid="true">
                      {t("amountRequired", { balance })}
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup
                    style={{
                      display: "flex",
                      margin: -20,
                      marginTop: 0,
                      padding: 10
                    }}
                  />
                </Form>
              </CardBody>
              <CardFooter className="text-right">
                <Button
                  id="submit"
                  color={this.isFieldValid("address") ? "primary" : "secondary"}
                  disabled={!this.isFieldValid("address")}
                  style={{
                    margin: 3
                  }}
                  onClick={this.onSubmit}
                >
                  {t("submit")}
                </Button>
                <Button onClick={actions.stopWithdrawing}>Close</Button>
              </CardFooter>
            </Card>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default connect(["info", "withdrawing", "withdrawalError", "symbol"])(
  translate()(Withdraw)
);
