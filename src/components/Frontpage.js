import React, { Component } from "react";
import { actions, connect } from "../store";
import QR from "qrcode.react";

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
          <h2>Node Info</h2>
          <span>IP address: {ownIp}</span>
          <br />
          <span>Ethereum address: {ethAddress}</span>
          <br />
          <QR
            style={{ marginTop: 15 }}
            size="150"
            bgcolor="#ff0"
            value={`althea://dao/add?ip_address=${ownIp}&eth_address=${ethAddress}`}
          />
        </div>
      </div>
    );
  }
}

export default connect(["info", "settings"])(FrontPage);
