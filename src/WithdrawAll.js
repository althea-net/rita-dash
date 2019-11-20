import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import { Error, txLink, toEth } from "utils";
import { post, useStore } from "store";
import bigGreenCheck from "images/big_green_check.png";
import { isAddress } from "ethereum-address";

const WithdrawAll = ({ open, setOpen }) => {
  const [t] = useTranslation();

  const [address, setAddress] = useState("");
  const [error, setError] = useState();
  const [txid, setTxid] = useState();

  const [{ balance, status }] = useStore();
  const { eth, dai } = status;

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const txid = await post(`/withdraw_all/${address}`);
      setTxid(txid.replace("txid:", ""));
    } catch {
      setError(t("withdrawalError"));
    }
  };

  const addressValid = !!(address && isAddress(address));
  const valid = addressValid;
  const link = txLink("Ethereum", txid);

  if (isNaN(eth) || isNaN(dai)) return null;

  return (
    <div>
      <Modal isOpen={open} toggle={() => setOpen(!open)}>
        <ModalHeader toggle={() => setOpen(!open)}>
          {t("withdrawAll")}
        </ModalHeader>
        <ModalBody>
          <Error error={error} />
          <div className="text-center">
            <h5 style={{ color: "gray", fontSize: 18 }} className="mb-1">
              {t("currentBalance")}
            </h5>
            <h4 className="w-100 mb-2">{toEth(balance)} DAI</h4>
            <h4 className="w-100 mb-2">{eth} ETH</h4>
          </div>

          {txid ? (
            <div className="w-100 text-center mx-auto">
              <img src={bigGreenCheck} alt="Checkmark" className="mb-2" />
              <p
                dangerouslySetInnerHTML={{
                  __html: t("withdrawAllSuccess", { txid, link })
                }}
                style={{ wordWrap: "break-word" }}
              />
              <Button
                type="button"
                color="primary"
                onClick={() => setOpen(false)}
                className="mr-2"
              >
                {t("close")}
              </Button>
            </div>
          ) : (
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
                  placeholder={t("recipientAddress")}
                  onChange={e => setAddress(e.target.value)}
                  value={address}
                  valid={addressValid}
                  invalid={!!(address && !addressValid)}
                />
                <FormFeedback invalid="true">
                  {t("addressRequired")}
                </FormFeedback>
              </FormGroup>

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
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default WithdrawAll;
