import React, { Component } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  FormFeedback,
  Input
} from "reactstrap";
import { actions, connect, getState } from "../store";
import web3 from "web3";
import Confirm from "./Confirm";
import Error from "./Error";
import { translate } from "react-i18next";
import QrReader from "react-qr-reader";
import QrCode from "qrcode.react";
import { Address6 } from "ip-address";

class ControlledInput extends Component {
  state = {
    newValue: this.props.newValue,
    defaultValue: this.props.defaultValue,
    value: this.props.defaultValue
  };

  onChange = e => {
    let { value } = e.target;
    this.setState({ value });
    this.props.onChange(e);
  };

  componentDidMount() {
    let { value } = this.state;
    let { name } = this.props;
    let e = { target: { name, value } };
    this.onChange(e);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.newValue !== nextProps.newValue) {
      return {
        newValue: nextProps.newValue,
        value: nextProps.newValue
      };
    }

    return null;
  }

  render() {
    let { value } = this.state;
    let { name, placeholder, valid, invalid, onBlur } = this.props;

    return (
      <Input
        name={name}
        placeholder={placeholder}
        onBlur={onBlur}
        onChange={this.onChange}
        value={value || ""}
        valid={valid}
        invalid={invalid}
      />
    );
  }
}

class DaoSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blurred: {
        daoAddress: false,
        meshIp: false
      },
      fields: {
        daoAddress: "",
        meshIp: ""
      },
      joining: false,
      confirming: false,
      ipNeedsFormatting: false,
      valid: {
        daoAddress: true,
        meshIp: true
      },
      validationWarning: false,
      newIpAddress: "",
      newDaoAddress: ""
    };
    this.validators = {
      daoAddress: a => web3.utils.isAddress(a),
      meshIp: ip => new Address6(ip).isValid()
    };
    this.web3 = new web3();
  }

  componentDidMount() {
    actions.getMeshIp();
    actions.getSubnetDaos();
    actions.getInfo();
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
      },
      valid: {
        ...this.state.valid,
        [name]: true
      },
      ipNeedsFormatting: false,
      validationWarning: false
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

    let meshIp = new Address6(this.state.fields.meshIp);
    if (meshIp.isValid() && meshIp.subnet !== "/128") {
      this.setState({ ipNeedsFormatting: true });
    }
  };

  startJoining = () => {
    if (typeof window.QRScanner !== "undefined") {
      window.QRScanner.prepare(err => {
        if (err) {
          console.error(err);
          return;
        }

        window.QRScanner.show(() => {
          document.querySelector(".App").style.display = "none";
          actions.startScanning();

          window.QRScanner.scan((err, res) => {
            if (err) {
              console.log(err);
            } else {
              this.handleScan(res);
            }

            actions.stopScanning();
          });
        });
      });
    } else {
      this.setState({ joining: true });
    }

    this.setState({
      fields: {
        daoAddress: "",
        meshIp: ""
      }
    });
  };

  handleScan = result => {
    if (result) {
      try {
        let { daoAddress, ipAddress } = JSON.parse(result);

        this.setState({
          joining: false,
          blurred: {
            daoAddress: true,
            meshIp: true
          },
          fields: {
            daoAddress,
            meshIp: ipAddress
          },
          valid: {
            daoAddress: this.validators.daoAddress(daoAddress),
            meshIp: this.validators.meshIp(ipAddress)
          },
          newIpAddress: ipAddress,
          newDaoAddress: daoAddress
        });
      } catch (e) {
        console.log("failed to parse subnet DAO QR code");
      }
    }
  };

  handleError = err => {
    console.error(err);
  };

  allValid = () => {
    let valid = {};
    for (let f in this.state.fields) {
      valid[f] = this.validators[f](this.state.fields[f]);
    }
    this.setState({ valid });
    console.log(valid);
    return Object.values(valid).reduce((a, b) => a && b, true);
  };

  submit = () => {
    this.setState({ validationWarning: false });
    if (this.allValid()) this.setState({ confirming: true });
    else this.setState({ validationWarning: true });
  };

  render() {
    let { daos, daosError, info } = this.props.state;
    let { t } = this.props;
    let { daoAddress, meshIp } = this.state.fields;
    let { confirming, joining, ipNeedsFormatting } = this.state;
    let ethAddress = info.address;
    let defaultMeshIp = this.props.state.meshIp;

    if (meshIp) {
      meshIp = new Address6(this.state.fields.meshIp).canonicalForm();
      if (meshIp) meshIp = meshIp.substr(0, meshIp.length - 1) + 1;
      else meshIp = "";
    }

    let defaultDaoAddress = "";
    if (daos.length) {
      defaultDaoAddress = daos[0];
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
                <p>{t("presentQR")}</p>
                <figure className="text-center">
                  {ethAddress && <QrCode value={ethAddress} size={300} />}
                  <figcaption>{ethAddress}</figcaption>
                </figure>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div id="viewer" style={{ width: "300px" }} />
                {joining ? (
                  <QrReader
                    onScan={this.handleScan}
                    onError={this.handleError}
                    style={{ width: "300px" }}
                  />
                ) : (
                  <Button color="primary" onClick={this.startJoining}>
                    {t("scanQR")}
                  </Button>
                )}
                <Confirm
                  show={confirming}
                  t={t}
                  cancel={() => this.setState({ confirming: false })}
                  confirm={() => {
                    actions.startWaiting();

                    let i = setInterval(async () => {
                      actions.keepWaiting();
                      if (getState().waiting <= 0) {
                        clearInterval(i);
                      }
                    }, 1000);

                    actions.joinSubnetDao(daoAddress, meshIp);

                    this.setState({ confirming: false });
                  }}
                />
                {this.state.validationWarning && (
                  <Alert color="danger">
                    There were validation errors when submitting the form
                  </Alert>
                )}
                <Form style={{ marginTop: 15 }}>
                  <FormGroup>
                    <ControlledInput
                      name="daoAddress"
                      placeholder="Subnet DAO Contract Address"
                      defaultValue={defaultDaoAddress}
                      onBlur={this.onBlur}
                      onChange={this.onFieldChange}
                      valid={
                        this.state.valid.daoAddress &&
                        this.state.blurred.daoAddress
                      }
                      invalid={!this.state.valid.daoAddress}
                      key={defaultDaoAddress}
                      newValue={this.state.newDaoAddress}
                    />
                    <FormFeedback invalid="true">
                      {t("enterEthAddress")}
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    {ipNeedsFormatting && (
                      <Alert color="info">
                        <strong>IP Subnet Detected</strong>
                        <p>
                          The router will be assigned the first non-zero address
                          in the range: {meshIp}
                        </p>
                      </Alert>
                    )}
                    <ControlledInput
                      newValue={this.state.newIpAddress}
                      name="meshIp"
                      placeholder="Ip Address"
                      defaultValue={defaultMeshIp}
                      onBlur={this.onBlur}
                      onChange={this.onFieldChange}
                      valid={
                        this.state.valid.meshIp && this.state.blurred.meshIp
                      }
                      invalid={!this.state.valid.meshIp}
                      key={defaultMeshIp}
                    />
                    <FormFeedback invalid="true">
                      {t("enterIpAddress")}
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Button
                      color="primary"
                      className="float-right"
                      onClick={this.submit}
                    >
                      Submit
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

export default connect(["daoAddress", "meshIp", "daos", "daosError", "info"])(
  translate()(DaoSelection)
);
