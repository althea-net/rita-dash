import React, { Component } from "react";
import { Button, Card, CardBody, Form, FormGroup, Input } from "reactstrap";
import { actions, connect } from "../store";
import { withTranslation } from "react-i18next";

class PriceQualityForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      factor: 0
    };
  }

  componentDidMount = () => {
    actions.getFactor();
  };

  setFactor = e => {
    let factor = e.target.value;
    this.setState({ factor });
  };

  onSubmit = e => {
    e.preventDefault();
    actions.setFactor(this.state.factor);
  };

  render() {
    let { t } = this.props;
    let { factor } = this.state;
    if (!factor) factor = this.props.state.factor;

    return (
      <Card>
        <CardBody>
          <h3>{t("priceQuality")}</h3>

          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Input
                type="range"
                min={0}
                max={6000}
                value={factor || ""}
                onChange={this.setFactor}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <small>{t("preferLow")}</small>
                <small>{t("preferHigh")}</small>
              </div>
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

export default connect(["factor"])(withTranslation()(PriceQualityForm));
