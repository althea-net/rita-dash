import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Progress,
} from "reactstrap";
import { get, post, useStore } from "store";
import { toEth, toWei, sleep } from "utils";
import { BigNumber } from "bignumber.js";
import { Error } from "utils";

const AbortController = window.AbortController;
const secondsPerMonth = 60 * 60 * 24 * 30;

const OperatorFee = ({ readonly = false }) => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [operatorFee, setOperatorFee] = useState();
  const [{ symbol }] = useStore();
  const [error, setError] = useState(false);

  const getOperatorFee = useCallback(async (signal) => {
    setLoading(true);
    try {
      let res = await get("/operator_fee", true, 5000, signal);
      if (!(res instanceof Error)) {
        let { operatorFee } = res;
        operatorFee = toEth(BigNumber(operatorFee).times(secondsPerMonth));
        setOperatorFee(operatorFee.toString());
      }
    } catch {}

    setLoading(false);
  }, []);

  const postOperatorFee = async (operatorFee) => {
    let operatorFeeWei = BigNumber(toWei(operatorFee))
      .div(secondsPerMonth)
      .toFixed(0);
    try {
      await post("/operator_fee/" + operatorFeeWei.toString(10));
      setSuccess(true);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getOperatorFee(signal);
    return () => controller.abort();
  }, [getOperatorFee]);

  const submit = (e) => {
    e.preventDefault();
    postOperatorFee(operatorFee);
  };

  const defaultFee = async () => {
    setLoading(true);
    await postOperatorFee(0);
    await sleep(16000);
    await getOperatorFee();
  };

  return (
    <Card className="mb-4">
      <CardBody>
        <Form onSubmit={submit}>
          <h4>{t("serviceCost")}</h4>
          <p>{t("theAmountYouPay")}</p>

          {success && <Alert color="success">{t("operatorFeeSaved")}</Alert>}
          <Error error={error} />

          {loading ? (
            <Progress animated color="primary" value="100" />
          ) : (
            <FormGroup>
              <Label for="price">{t("monthlyCost")}</Label>
              <div className="d-flex flex-wrap">
                <InputGroup
                  className="mr-3 mb-2"
                  style={{ flexWrap: "nowrap", width: 350 }}
                >
                  <Input
                    name="operatorFee"
                    id="operatorFee"
                    onChange={(e) => setOperatorFee(e.target.value)}
                    value={operatorFee}
                    style={{ borderRight: "none", minWidth: 80 }}
                    readOnly={readonly}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText
                      style={{
                        background: "#F8F9FA",
                        fontSize: 14,
                        color: "#888",
                      }}
                    >
                      {symbol} / {t("month")}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {readonly || (
                  <div>
                    <Button type="submit" color="primary">
                      {t("save")}
                    </Button>
                    <Button
                      type="button"
                      color="primary"
                      outline
                      className="ml-1"
                      onClick={defaultFee}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {t("defaultFee")}
                    </Button>
                  </div>
                )}
              </div>
            </FormGroup>
          )}
        </Form>
      </CardBody>
    </Card>
  );
};

export default OperatorFee;
