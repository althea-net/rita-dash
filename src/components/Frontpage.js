import React, { Component } from "react";
import { actions, connect } from "../store";
import QR from "qrcode.react";
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";

class FrontPage extends Component {
  componentDidMount() {
    actions.getInfo();
    actions.getSettings();
  }

  render() {
    let { info, settings } = this.props.state;
    let { ownIp } = settings.network;
    let { ethAddress } = settings.payment;

    return (
      <div>
        <h1>Welcome to Althea</h1>
        <p>You are running version {info.version}</p>

        <div>
          <Card>
            <CardBody>
              <Row>
                <Col md="4">
                  <QR
                    style={{ height: "100%", width: "100%", paddingBottom: 15 }}
                    bgcolor="#ff0"
                    value={`althea://dao/add?ip_address=${ownIp}&eth_address=${ethAddress}`}
                  />
                </Col>
                <Col md="8" style={{ wordWrap: "break-word" }}>
                  <CardTitle>Node Info</CardTitle>
                  <p>
                    <b>Mesh IP:</b> {ownIp}
                  </p>
                  <p>
                    <b>Ethereum Address:</b> {ethAddress}
                  </p>
                  <p>
                    Present this QR code to your local subnet DAO organizer to
                    have your node added to the DAO.
                  </p>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}

export default connect(["info", "settings"])(FrontPage);
