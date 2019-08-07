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
  Progress
} from "reactstrap";
import { get, post, useStore } from "store";
import { toEth, toWei, sleep } from "utils";
import { BigNumber } from "bignumber.js";

const AbortController = window.AbortController;
const secondsPerMonth = 60 * 60 * 24 * 30;

const DaoFee = ({ readonly = false }) => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [daoFee, setDaoFee] = useState();
  const [{ symbol }] = useStore();

  const getDaoFee = useCallback(async signal => {
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
  }, []);

  const postDaoFee = async daoFee => {
    let daoFeeWei = BigNumber(toWei(daoFee))
      .div(secondsPerMonth)
      .toFixed(0);
    try {
      await post("/dao_fee/" + daoFeeWei.toString(10));
      setSuccess(true);
    } catch {}
  };

  useEffect(
    () => {
      const controller = new AbortController();
      const signal = controller.signal;
      getDaoFee(signal);
      return () => controller.abort();
    },
    [getDaoFee]
  );

  const submit = e => {
    e.preventDefault();
    postDaoFee(daoFee);
  };

  const defaultFee = async () => {
    setLoading(true);
    await postDaoFee(0);
    await sleep(16000);
    await getDaoFee();
  };

  return (
    <Card className="mb-4">
      <CardBody>
        <Form onSubmit={submit}>
          <h4>{t("daoFee")}</h4>

          {success && <Alert color="success">{t("daoFeeSaved")}</Alert>}

          {loading ? (
            <Progress animated color="info" value="100" />
          ) : (
            <FormGroup>
              <Label for="price">{t("monthlyCost")}</Label>
              <div className="d-flex flex-wrap">
                <InputGroup
                  className="mr-3 mb-2"
                  style={{ flexWrap: "nowrap", width: 350 }}
                >
                  <Input
                    label={t("daoFee")}
                    name="daoFee"
                    id="daoFee"
                    onChange={e => setDaoFee(e.target.value)}
                    value={daoFee}
                    style={{ borderRight: "none", minWidth: 80 }}
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
                      {symbol} / {t("month")}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {readonly || (
                  <>
                    <Button type="submit" color="primary">
                      {t("save")}
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      className="ml-1"
                      onClick={defaultFee}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {t("defaultFee")}
                    </Button>
                  </>
                )}
              </div>
            </FormGroup>
          )}
        </Form>
      </CardBody>
    </Card>
  );
};

export default DaoFee;
