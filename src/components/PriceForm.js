import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import { actions, connect } from "../store";
import { translate } from "react-i18next";
import { BigNumber } from "bignumber.js";

const weiPerEth = BigNumber("1000000000000000000");
const bytesPerGb = BigNumber("1000000000");

class PriceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: 0
    };
  }

  componentDidMount = () => {
    actions.getPrice();
  };

  setPrice = e => {
    let price = e.target.value;
    price = BigNumber(price.toString())
      .times(weiPerEth)
      .div(bytesPerGb)
      .toFixed(0);

    this.setState({ price });
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
    if (!price) price = this.props.state.price;

    let priceEthPerGB = BigNumber(price.toString())
      .times(bytesPerGb)
      .div(weiPerEth)
      .toFixed(8);

    return (
      <Card style={{ height: "100%" }}>
        <CardBody>
          <Form onSubmit={this.onSubmit}>
            <FormGroup id="form">
              <h3>{t("price")}</h3>
              <InputGroup>
                <Input
                  label={t("price")}
                  type="number"
                  name="price"
                  placeholder={t("enterPrice")}
                  onChange={this.setPrice}
                  value={priceEthPerGB || ""}
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText>♦/GB</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
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

export default connect(["price"])(translate()(PriceForm));
