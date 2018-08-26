import React, { Component } from "react";
// import Exits from "./Exits";
import DaoSelection from "./DaoSelection";

class NetworkSettings extends Component {
  render() {
    return (
      <div>
        <h1>Network Settings</h1>
        <p>
          Exit nodes are like a combination of a VPN and a speedtest server.
          They keep your browsing history private and make sure that your
          traffic is always routed through the fastest path in the network at a
          given price.
        </p>
        <p>
          Exit nodes need to collect a bit of information about you (your email
          address), and you need to select an exit node in your region. Althea
          runs some exit nodes, but in the future you will be able to select
          exits from other companies if you prefer.
        </p>
        {/* <Exits /> */}
        <DaoSelection />
      </div>
    );
  }
}

export default NetworkSettings;
