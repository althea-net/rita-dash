import React from "react";
import QR from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Card,
  CardBody,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label
} from "reactstrap";

class NodeInformation extends React.Component {
  state = {
    qrvalue: ""
  };

  setQr = qrvalue => {
    this.setState({ qrvalue });
  };

  render() {
    let { qrvalue } = this.state;
    let { address, settings, t } = this.props;
    let { meshIp, wgPublicKey } = settings.network;

    return (
      <React.Fragment>
        <h2>Node Information</h2>
        <Card>
          <CardBody>
            {qrvalue && (
              <div className="text-center">
                <QR
                  style={{
                    height: "auto",
                    width: "50%"
                  }}
                  value={qrvalue}
                />
              </div>
            )}
            <Label>
              <b>{t("meshIp")}</b>
            </Label>
            <InputGroup>
              <Input readOnly value={meshIp || ""} />
              <InputGroupAddon addonType="append">
                <InputGroupText
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.setQr(meshIp);
                  }}
                >
                  <FontAwesomeIcon icon="qrcode" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <Label>
              <b>{t("ethereumAddress")}</b>
            </Label>
            <InputGroup>
              <Input readOnly value={address || ""} />
              <InputGroupAddon addonType="append">
                <InputGroupText
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.setQr(address);
                  }}
                >
                  <FontAwesomeIcon icon="qrcode" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <Label>
              <b>{t("wireguardPublicKey")}</b>
            </Label>
            <InputGroup>
              <Input readOnly value={wgPublicKey || ""} />
              <InputGroupAddon addonType="append">
                <InputGroupText
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.setQr(wgPublicKey);
                  }}
                >
                  <FontAwesomeIcon icon="qrcode" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}

export default NodeInformation;
