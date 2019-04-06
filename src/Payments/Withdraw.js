import React, { useContext, useState } from "react";
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
import { actions, Context } from "store";
import { Error, Success } from "utils";
import { BigNumber } from "bignumber.js";
import Web3 from "web3";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const weiPerEth = BigNumber("1000000000000000000");

export default ({ open, setOpen }) => {
  let [t] = useTranslation();

  let [address, setAddress] = useState("");
  let [amount, setAmount] = useState("");

  let {
    state: { balance, symbol, withdrawalError, withdrawalSuccess }
  } = useContext(Context);

  let onSubmit = async e => {
    e.preventDefault();

    amount = BigNumber(amount.toString())
      .times(weiPerEth)
      .toString();

    actions.withdraw(address, amount);
  };

  let fAmount = parseFloat(amount);
  let addressValid = !!(address && web3.utils.isAddress(address));
  let amountValid = !!(!isNaN(fAmount) && fAmount > 0 && fAmount <= balance);
  let valid = addressValid && amountValid;

  return (
    <div>
      <Modal isOpen={open} toggle={() => setOpen(!open)}>
        <ModalHeader>
          {t("withdraw")} {symbol}
        </ModalHeader>
        <ModalBody>
          <Error error={withdrawalError} />
          <Success message={withdrawalSuccess} />

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
                valid={addressValid}
                invalid={!!(address && !addressValid)}
              />
              <FormFeedback invalid="true">{t("addressRequired")}</FormFeedback>
            </FormGroup>
            <FormGroup id="form">
              <Label for="amount" style={{ marginRight: 5 }}>
                <b>{t("amount")}</b>
              </Label>
              <InputGroup
                className={amount && !amountValid ? "is-invalid" : null}
              >
                <Input
                  id={"amount"}
                  label={t("to")}
                  type="number"
                  name="amount"
                  placeholder={0}
                  onChange={e => setAmount(e.target.value)}
                  value={amount}
                  valid={amountValid}
                  invalid={!!(amount && !amountValid)}
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

            <div className="d-flex justify-content-center">
              <Button
                type="button"
                color="primary"
                outline
                onClick={() => setOpen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button color="primary" disabled={!valid}>
                {t("withdraw")}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};
