import React, { Component } from "react";
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
  InputGroupText
} from "reactstrap";
import { actions, connect } from "../store";
import { translate } from "react-i18next";

class PriceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: null
    };
  }

  componentDidMount = () => {
    actions.getPrice();
    actions.getAutoPricing();
  };

  setPrice = e => {
    let price = e.target.value;
    this.setState({ price });
  };

  togglePricing = () => {
    actions.toggleAutoPricing();
  };

  onSubmit = e => {
    e.preventDefault();
    let price = this.state.price;
    if (!price) price = this.props.state.price;
    actions.setPrice(price);
  };

  render() {
    let { t } = this.props;
    let { price } = this.state;
    if (price === null) price = this.props.state.price;
    let { autoPricing } = this.props.state;

    return (
      <Card style={{ height: "100%" }}>
        <CardBody>
          <Form onSubmit={this.onSubmit}>
            <FormGroup id="form">
              <h3>{t("price")}</h3>
              <InputGroup>
                <Input
                  label={t("price")}
                  name="price"
                  placeholder={t("enterPrice")}
                  onChange={this.setPrice}
                  value={price || ""}
                  disabled={autoPricing}
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText>ETH/GB</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <CustomInput
                type="checkbox"
                id="autoPricing"
                label={t("automatedPricing")}
                onClick={this.togglePricing}
                value={autoPricing}
                checked={autoPricing}
              />
            </FormGroup>
            <FormGroup>
              <Button color="primary">{t("save")}</Button>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

export default connect(["autoPricing", "price"])(translate()(PriceForm));
