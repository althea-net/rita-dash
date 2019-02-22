import React, { Component } from "react";
import {
  Alert,
  Button,
  Form,
  FormGroup,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import { actions, connect, getState } from "../store";
import Web3 from "web3";
import Confirm from "./Confirm";
import Error from "./Error";
import { withTranslation } from "react-i18next";
import QrReader from "react-qr-reader";
import QrCode from "qrcode.react";
import { Address6 } from "ip-address";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

class SubnetSelection extends Component {
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
      daoAddress: a => this.web3.utils.isAddress(a),
      meshIp: ip => new Address6(ip).isValid()
    };
    this.web3 = new Web3(Web3.givenProvider);
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
      },
      newIpAddress: "",
      newDaoAddress: ""
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
    return Object.values(valid).reduce((a, b) => a && b, true);
  };

  submit = () => {
    this.setState({ validationWarning: false });
    if (this.allValid()) this.setState({ confirming: true });
    else this.setState({ validationWarning: true });
  };

  cancel = () => this.setState({ confirming: false });

  confirm = () => {
    let { daoAddress, meshIp } = this.state.fields;
    actions.startWaiting();

    let i = setInterval(async () => {
      actions.keepWaiting();
      if (getState().waiting <= 0) {
        clearInterval(i);
      }
    }, 1000);

    actions.joinSubnetDao(daoAddress, meshIp);

    this.setState({ confirming: false });
  };

  render() {
    let { daos, daosError, info } = this.props.state;
    let { t } = this.props;
    let { meshIp } = this.state.fields;
    let { confirming, joining, showQR, ipNeedsFormatting } = this.state;
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
      <>
        <p>{t("yourOrganizer")}</p>
        <div id="viewer" style={{ width: "300px" }} />
        {joining && (
          <QrReader
            onScan={this.handleScan}
            onError={this.handleError}
            style={{ width: "300px", marginTop: 15 }}
          />
        )}
        <Form style={{ marginTop: 15 }}>
          <FormGroup>
            {ipNeedsFormatting && (
              <Alert color="info">
                <strong>IP Subnet Detected</strong>
                <p>
                  The router will be assigned the first non-zero address in the
                  range: {meshIp}
                </p>
              </Alert>
            )}
            <ControlledInput
              name="meshIp"
              placeholder={t("ipAddress")}
              defaultValue={defaultMeshIp}
              onBlur={this.onBlur}
              onChange={this.onFieldChange}
              valid={this.state.valid.meshIp && this.state.blurred.meshIp}
              invalid={!this.state.valid.meshIp}
              key={defaultMeshIp}
              newValue={this.state.newIpAddress}
            />
            <FormFeedback invalid="true">{t("enterIpAddress")}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <ControlledInput
              name="daoAddress"
              placeholder={t("subnetAddress")}
              defaultValue={defaultDaoAddress}
              onBlur={this.onBlur}
              onChange={this.onFieldChange}
              valid={
                this.state.valid.daoAddress && this.state.blurred.daoAddress
              }
              invalid={!this.state.valid.daoAddress}
              key={defaultDaoAddress}
              newValue={this.state.newDaoAddress}
            />
            <FormFeedback invalid="true">{t("enterEthAddress")}</FormFeedback>
          </FormGroup>
          <div className="d-flex">
            <Button
              onClick={this.startJoining}
              className="mr-2"
              outline
              color="primary"
              style={{ width: 180 }}
            >
              {t("scanQR")}
            </Button>
            <Button
              color="primary"
              onClick={this.submit}
              style={{ width: 180 }}
            >
              {t("save")}
            </Button>
          </div>
        </Form>
        <hr />
        {daosError ? (
          <Error error={daosError} />
        ) : (
          <div>
            <p>{t("presentQR")}</p>
            {showQR && (
              <figure className="text-center">
                {ethAddress && <QrCode value={ethAddress} size={300} />}
                <figcaption>{ethAddress}</figcaption>
              </figure>
            )}
            <InputGroup>
              <Input readOnly value={ethAddress || ""} />
              <InputGroupAddon addonType="append">
                <InputGroupText
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.setState({ showQR: !showQR });
                  }}
                >
                  <FontAwesomeIcon icon="qrcode" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <Confirm
              open={confirming}
              cancel={this.cancel}
              confirm={this.confirm}
            />
            {this.state.validationWarning && (
              <Alert color="danger">
                There were validation errors when submitting the form
              </Alert>
            )}
          </div>
        )}
      </>
    );
  }
}

export default connect(["daoAddress", "meshIp", "daos", "daosError", "info"])(
  withTranslation()(SubnetSelection)
);
