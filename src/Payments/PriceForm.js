import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CustomInput,
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
import useInterval from "utils/UseInterval";
import { BigNumber } from "bignumber.js";
import AppContext from "store/App";

const weiPerEth = BigNumber("1000000000000000000");
const bytesPerGb = BigNumber("1000000000");

const PriceForm = () => {
  const [t] = useTranslation();
  const [price, setPrice] = useState(0);
  const [autoPricing, setAutoPricing] = useState(false);
  const [newPrice, setNewPrice] = useState(price);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { symbol } = useContext(AppContext);

  const getPrice = async () => {
    const priceWei = (await get("/local_fee", true, 5000)).localFee;

    const price = BigNumber(priceWei)
      .div(weiPerEth)
      .times(bytesPerGb)
      .toString();

    setPrice(price);
    if (autoPricing) setNewPrice(price);

    setLoading(false);
  };

  const getAutoPricing = async () => {
    setLoading(true);
    setAutoPricing(await get("/auto_price/enabled"));
    setLoading(false);
  };

  useEffect(() => {
    getPrice();
    getAutoPricing();
  }, []);
  useInterval(getPrice, 5000);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);

    const value = newPrice || price;

    const priceWei = BigNumber(value)
      .times(weiPerEth)
      .div(bytesPerGb)
      .toFixed(0);

    await post(`/local_fee/${priceWei}`);

    setSuccess(true);
    setLoading(false);
  };

  const togglePricing = async () => {
    setSuccess(false);

    setAutoPricing(!autoPricing);
    await post(`/auto_price/enabled/${!autoPricing}`);
    if (autoPricing) setNewPrice(0);
    else setLoading(true);
  };

  const changePrice = e => {
    setSuccess(false);
    setNewPrice(e.target.value);
  };

  return (
    <Card className="mb-4">
      <CardBody>
        <Form onSubmit={submit}>
          <FormGroup id="form">
            <h3>{t("sellingBandwidth")}</h3>

            <p>{t("setYourBandwidth")}</p>

            {loading && <Progress animated color="info" value="100" />}
            {success && <Alert color="success">{t("priceSaved")}</Alert>}

            <Label for="price">{t("bandwidthPrice")}</Label>

            <div className="d-flex">
              <InputGroup className="mr-3" style={{ width: 350 }}>
                <Input
                  label={t("price")}
                  name="price"
                  placeholder={t("enterPrice")}
                  onChange={changePrice}
                  value={newPrice || price}
                  readOnly={autoPricing}
                  style={{ borderRight: "none" }}
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText
                    style={{
                      background: "#F8F9FA",
                      fontSize: 14,
                      color: "#888"
                    }}
                  >
                    {symbol} / GB
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <Button color="primary">{t("save")}</Button>
            </div>
          </FormGroup>
          <FormGroup className="d-flex">
            <CustomInput
              type="checkbox"
              id="autoPricing"
              onChange={togglePricing}
              value={autoPricing}
              checked={autoPricing}
            />
            <Label for="autoPricing">{t("automatedPricing")}</Label>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
};

export default PriceForm;
