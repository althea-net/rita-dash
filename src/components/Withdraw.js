import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import { actions } from "../store";
import { BigNumber } from "bignumber.js";
import web3 from "web3";

const weiPerEth = BigNumber("1000000000000000000");

export default ({ withdrawing, setWithdrawing, balance, symbol }) => {
  let [t] = useTranslation();
  let [address, setAddress] = useState("");
  let [amount, setAmount] = useState("");

  let validate = param => {
    return {
      address: a => web3.utils.isAddress(a),
      amount: a => !isNaN(a) && a > 0 && a <= balance
    }[Object.keys(param)[0]];
  };

  let onSubmit = async e => {
    e.preventDefault();
    if (!validate.address(address)) return;

    amount = BigNumber(amount.toString())
      .times(weiPerEth)
      .toString();

    actions.withdraw(address, amount);
  };

  return (
    <div>
      <Modal isOpen={withdrawing} toggle={() => setWithdrawing(!withdrawing)}>
        <ModalHeader>
          {t("withdraw")} {symbol}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={onSubmit} className="text-left">
            <FormGroup id="form">
              <Label for="address" style={{ marginRight: 5 }}>
                <b>{t("sendTo")}</b>
              </Label>
              <Input
                id={"address"}
                label={t("to")}
                type="text"
                name="address"
                placeholder={t("enterEthAddress")}
                onChange={e => setAddress(e.target.value)}
                value={address}
              />
              <FormFeedback invalid="true">{t("addressRequired")}</FormFeedback>
            </FormGroup>
            <FormGroup id="form">
              <Label for="amount" style={{ marginRight: 5 }}>
                <b>{t("amount")}</b>
              </Label>
              <InputGroup>
                <Input
                  id={"amount"}
                  label={t("to")}
                  type="text"
                  name="amount"
                  placeholder={0}
                  onChange={e => setAmount(e.target.value)}
                  value={amount}
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText
                    style={{
                      background: "#F8F9FA",
                      fontSize: 14,
                      color: "#888"
                    }}
                  >
                    {symbol}
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
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
          <div className="d-flex justify-content-center">
            <Button
              color="primary"
              outline
              onClick={() => setWithdrawing(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button color="primary">{t("withdraw")}</Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};
