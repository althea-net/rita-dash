import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
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
import { actions, connect } from "store";

export default connect(["autoPricing", "price", "loadingPrice", "symbol"])(
  ({ state: { autoPricing, price, loadingPrice, symbol } }) => {
    useEffect(() => {
      actions.getPrice();
      actions.getAutoPricing();
      let timer = setInterval(actions.getPrice, 10000);
      return () => clearInterval(timer);
    }, []);

    let [t] = useTranslation();

    const [newPrice, setNewPrice] = useState(0);

    const onSubmit = () => {
      actions.setPrice(newPrice);
    };

    const togglePricing = () => {
      actions.toggleAutoPricing();
    };

    return (
      <Card className="mb-4">
        <CardBody>
          <Form onSubmit={onSubmit}>
            <FormGroup id="form">
              {loadingPrice && <Progress animated color="info" value="100" />}
              <h3>{t("sellingBandwidth")}</h3>
              <p>Set the price for your bandwidth.</p>

              <Label for="price">{t("bandwidthPrice")}</Label>

              <div className="d-flex">
                <InputGroup className="mr-3" style={{ width: 350 }}>
                  <Input
                    label={t("price")}
                    name="price"
                    placeholder={t("enterPrice")}
                    onChange={setNewPrice}
                    value={newPrice}
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
  }
);
