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
import QrReader from "react-qr-reader";

class DaoSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      joining: false,
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

  startJoining = () => {
    this.setState({ joining: true });
  };

  handleScan = result => {
    if (result) this.setState({ ipAddress: result });
  };

  handleError = err => {
    console.error(err);
  };

  render() {
    let { daos, daosError } = this.props.state;
    let { t } = this.props;
    let { joining } = this.state;

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
            {joining ? (
              <QrReader onScan={this.handleScan} onError={this.handleError} />
            ) : (
              <Button color="primary" onClick={this.startJoining}>
                Join Subnet DAO with QR code
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default connect(["daos", "daosError"])(translate()(DaoSelection));
