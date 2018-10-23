import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  FormFeedback,
  Input
} from "reactstrap";
import { actions, connect } from "../store";
import web3 from "web3";
import Confirm from "./Confirm";
import Error from "./Error";
import { translate } from "react-i18next";
import QrReader from "react-qr-reader";
import QrCode from "qrcode.react";
import { Address6 } from "ip-address";

class DaoSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blurred: {
        contractAddress: false,
        ipAddress: false
      },
      fields: {
        contractAddress: "",
        ipAddress: ""
      },
      joining: false,
      confirming: false,
      valid: {
        contractAddress: true,
        ipAddress: true
      }
    };
    this.validators = {
      contractAddress: a => web3.utils.isAddress(a),
      ipAddress: ip => new Address6(ip).isValid()
    };
    this.web3 = new web3();
  }

  componentDidMount() {
    actions.getSubnetDaos();
  }

  onFieldChange = e => {
    const { name, value } = e.target;

    this.setState({
      blurred: {
        [name]: false
      },
      fields: {
        ...this.state.fields,
        [name]: value
      }
    });
  };

  onBlur = e => {
    const { name, value } = e.target;

    this.setState({
      blurred: {
        [name]: true
      },
      valid: {
        ...this.state.valid,
        [name]: this.validators[name](value)
      }
    });
  };

  startJoining = () => {
    this.setState({
      fields: {
        contractAddress: "",
        ipAddress: ""
      },
      joining: true
    });
  };

  handleScan = result => {
    if (result) {
      try {
        let { contractAddress, ipAddress } = JSON.parse(result);
        ipAddress = ipAddress.replace("::/64", "::1");

        this.setState({
          joining: false,
          blurred: {
            contractAddress: true,
            ipAddress: true
          },
          fields: {
            contractAddress,
            ipAddress
          },
          valid: {
            contractAddress: this.validators.contractAddress(contractAddress),
            ipAddress: this.validators.ipAddress(ipAddress)
          }
        });
      } catch (e) {
        console.log("failed to parse subnet DAO QR code");
      }
    }
  };

  handleError = err => {
    console.error(err);
  };

  render() {
    let { daos, daosError, settings } = this.props.state;
    let { ethAddress } = settings.payment;
    let { t } = this.props;
    let { contractAddress, ipAddress } = this.state.fields;
    let { confirming, joining } = this.state;

    if (!ipAddress) ipAddress = settings.network.meshIp;
    if (daos && daos.length) {
      contractAddress = daos[0];
    }

    return (
      <div>
        <h2>{t("subnetDao")}</h2>
        {daosError ? (
          <Error error={daosError} />
        ) : (
          <div>
            <Card>
              <CardBody>
                <p>
                  Present this QR code to the Subnet DAO organizer to have them
                  record your router's Ethereum wallet address
                </p>
                {ethAddress && (
                  <QrCode value={JSON.stringify({ ethAddress })} />
                )}
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                {joining ? (
                  <QrReader
                    onScan={this.handleScan}
                    onError={this.handleError}
                    style={{ width: "300px" }}
                  />
                ) : (
                  <Button color="primary" onClick={this.startJoining}>
                    Scan QR Code to fill in Subnet Details
                  </Button>
                )}
                <Confirm
                  show={confirming}
                  t={t}
                  cancel={() => this.setState({ confirming: false })}
                  confirm={() => {
                    actions.startWaiting();
                    actions.joinSubnetDao(contractAddress, ipAddress);
                    this.setState({ confirming: false });
                  }}
                />
                <Form style={{ marginTop: 15 }}>
                  <FormGroup>
                    <Input
                      name="contractAddress"
                      placeholder="Subnet DAO Contract Address"
                      onChange={this.onFieldChange}
                      onBlur={this.onBlur}
                      valid={
                        this.state.valid.contractAddress &&
                        this.state.blurred.contractAddress
                      }
                      invalid={
                        !(this.state.valid.contractAddress || !contractAddress)
                      }
                      value={contractAddress || ""}
                    />
                    <FormFeedback invalid="true">
                      {t("enterEthAddress")}
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Input
                      name="ipAddress"
                      placeholder="Mesh IP Address"
                      onChange={this.onFieldChange}
                      onBlur={this.onBlur}
                      valid={
                        this.state.valid.ipAddress &&
                        this.state.blurred.ipAddress
                      }
                      invalid={!(this.state.valid.ipAddress || !ipAddress)}
                      value={ipAddress || ""}
                    />
                    <FormFeedback invalid="true">
                      {t("enterIpAddress")}
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Button
                      color="primary"
                      className="float-right"
                      onClick={() => this.setState({ confirming: true })}
                    >
                      Join
                    </Button>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    );
  }
}

export default connect(["daos", "daosError", "settings"])(
  translate()(DaoSelection)
);
