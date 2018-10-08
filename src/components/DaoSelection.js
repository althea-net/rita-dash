import React, { Component } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  FormFeedback,
  Input,
  ListGroup,
  ListGroupItem,
  Row
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { actions, connect } from "../store";
import web3 from "web3";
import Error from "./Error";
import { translate } from "react-i18next";

class DaoSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      valid: false
    };
    this.web3 = new web3();
  }
  componentDidMount() {
    actions.getSubnetDaos();
  }

  addressUpdated = e => {
    let address = e.target.value;
    this.setState({ address, valid: web3.utils.isAddress(address) });
  };

  addSubnetDao = () => {
    actions.addSubnetDao(this.state.address);
    this.setState({ address: "" });
  };

  render() {
    let { daos, daosError } = this.props.state;
    let { t } = this.props;

    return (
      <div>
        <h2>{t("subnetDaos")}</h2>
        {daosError ? (
          <Error error={daosError} />
        ) : (
          <div>
            <Form>
              <FormGroup>
                <Row>
                  <Col md="9">
                    <Input
                      placeholder={t("putAddress")}
                      onChange={this.addressUpdated}
                      valid={this.state.valid}
                      invalid={!(this.state.valid || !this.state.address)}
                      value={this.state.address}
                    />
                  </Col>
                  <Col md="3">
                    <Button
                      color="primary"
                      className="float-right"
                      onClick={this.addSubnetDao}
                    >
                      {t("addSubnetDao")}
                    </Button>
                    <FormFeedback invalid="true">
                      {t("enterEthAddress")}
                    </FormFeedback>
                  </Col>
                </Row>
              </FormGroup>
            </Form>
            <ListGroup style={{ marginTop: 10 }}>
              {daos.map((address, i) => {
                return (
                  <ListGroupItem key={i}>
                    <Button
                      className="float-right"
                      style={{ background: "white", color: "black" }}
                      onClick={() => {
                        actions.removeSubnetDao(address);
                      }}
                    >
                      <FontAwesomeIcon icon="minus-circle" color="black" />
                      &nbsp; {t("remove")}
                    </Button>
                    {address}
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          </div>
        )}
      </div>
    );
  }
}

export default connect(["daos", "daosError"])(translate()(DaoSelection));
