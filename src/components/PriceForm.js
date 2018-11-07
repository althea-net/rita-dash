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
    this.setState({ price });
  };

  onSubmit = e => {
    e.preventDefault();
    actions.setPrice(this.state.price);
  };

  render() {
    let { t } = this.props;
    let { price } = this.state;
    if (!price) price = this.props.state.price;

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
                  value={price || ""}
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText>{t("weiPerGB")}</InputGroupText>
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
