import React, { useContext, useEffect, useState } from "react";
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
  Progress
} from "reactstrap";
import { get, post } from "store";
import AppContext from "store/App";
import { toEth, toWei } from "utils";
import { BigNumber } from "bignumber.js";

const AbortController = window.AbortController;
const secondsPerMonth = 60 * 60 * 24 * 30;

const DaoFee = ({ readonly = false }) => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [daoFee, setDaoFee] = useState();
  const { symbol } = useContext(AppContext);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      setLoading(true);
      try {
        let res = await get("/dao_fee", true, 5000, signal);
        if (!(res instanceof Error)) {
          let { daoFee } = res;
          daoFee = toEth(BigNumber(daoFee).times(secondsPerMonth));
          setDaoFee(daoFee.toString());
        }
      } catch {}

      setLoading(false);
    })();

    return () => controller.abort();
  }, []);

  const submit = async e => {
    e.preventDefault();
    let daoFeeWei = BigNumber(toWei(daoFee))
      .div(secondsPerMonth)
      .toFixed(0);
    try {
      await post("/dao_fee/" + daoFeeWei.toString(10));
      setSuccess(true);
    } catch {}
  };

  return (
    <Card className="mb-4">
      <CardBody>
        <Form onSubmit={submit}>
          <h3>{t("daoFee")}</h3>

          {success && <Alert color="success">{t("priceSaved")}</Alert>}

          {loading ? (
            <Progress animated color="info" value="100" />
          ) : (
            <FormGroup>
              <Label for="price">{t("monthlyCost")}</Label>
              <div className="d-flex">
                <InputGroup className="mr-3" style={{ width: 350 }}>
                  <Input
                    label={t("daoFee")}
                    name="daoFee"
                    id="daoFee"
                    onChange={e => setDaoFee(e.target.value)}
                    value={daoFee}
                    style={{ borderRight: "none" }}
                    readOnly={readonly}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText
                      style={{
                        background: "#F8F9FA",
                        fontSize: 14,
                        color: "#888"
                      }}
                    >
                      {symbol} / month
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {readonly || <Button color="primary">{t("save")}</Button>}
              </div>
            </FormGroup>
          )}
        </Form>
      </CardBody>
    </Card>
  );
};

export default DaoFee;
