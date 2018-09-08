import React, { Component } from "react";
import { actions, connect } from "../store";
import QR from "qrcode.react";
import { Card, CardBody, CardTitle, Col, Progress, Row } from "reactstrap";
import Error from "./Error";
import { translate } from "react-i18next";

class FrontPage extends Component {
  componentDidMount() {
    actions.getInfo();
    actions.getSettings();
  }

  render() {
    let { error, loading, info, settings } = this.props.state;
    let { ownIp } = settings.network;
    let { ethAddress } = settings.payment;
    let { version } = info;
    let { t } = this.props;

    return (
      <div>
        <h1>{t("welcome")}</h1>

        {error ? (
          <Error error={error} />
        ) : loading ? (
          <Progress animated color="info" value="100" />
        ) : (
          <div>
            <p>{t("version", { version })}</p>
            <Card>
              <CardBody>
                <Row>
                  <Col md="4">
                    <QR
                      style={{
                        height: "100%",
                        width: "100%",
                        maxWidth: 300,
                        paddingBottom: 15
                      }}
                      bgcolor="#ff0"
                      value={`althea://dao/add?ip_address=${ownIp}&eth_address=${ethAddress}`}
                    />
                  </Col>
                  <Col md="8" style={{ wordWrap: "break-word" }}>
                    <CardTitle>{t("nodeInfo")}</CardTitle>
                    <p>
                      <b>{t("meshIp")}</b> {ownIp}
                    </p>
                    <p>
                      <b>{t("ethereumAddress")}</b> {ethAddress}
                    </p>
                    <p>{t("presentQR")}</p>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    );
  }
}

export default translate("translations")(
  connect(["error", "loading", "info", "settings"])(FrontPage)
);
