import React, { Component } from "react";
import { connect } from "../store";
import QR from "qrcode.react";
import {
  Alert,
  Card,
  CardBody,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Progress
} from "reactstrap";
import Error from "./Error";
import { translate } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class FrontPage extends Component {
  constructor(props) {
    super();

    this.state = {
      qrvalue: ""
    };
  }

  setQr(qrvalue) {
    this.setState({ qrvalue });
  }

  render() {
    let { error, loading, info, settings } = this.props.state;
    let { meshIp, wgPublicKey } = settings.network;
    let { address, ritaVersion, version } = info;
    let { qrvalue } = this.state;
    let { t } = this.props;

    return (
      <div id="front-page-main">
        <h1>{t("welcome")}</h1>

        {error ? (
          <Error error={error} />
        ) : loading ? (
          <Progress animated color="info" value="100" />
        ) : (
          <div>
            <Alert color="info" id="version">
              {t("version")} <b>{version}</b>
              <br />
              {t("ritaVersion")} <b>{ritaVersion}</b>
            </Alert>
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
          </div>
        )}
      </div>
    );
  }
}

export default connect(["error", "loading", "info", "settings"])(
  translate()(FrontPage)
);
