import React, { Component } from "react";
import AltheaNav from "./Nav";
import Frontpage from "./Frontpage.js";
import Neighbors from "./Neighbors.js";
import RouterSettings from "./RouterSettings.js";
import NetworkSettings from "./NetworkSettings.js";
import Payments from "./Payments.js";
import { actions, connect } from "../store";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBan,
  faMinusCircle,
  faRoute,
  faSignal,
  faSitemap,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import neighbors from "../images/neighbors.svg";
import network from "../images/network.svg";
import router from "../images/router.svg";
import payments from "../images/payments.svg";

library.add(faBan);
library.add(faMinusCircle);
library.add(faRoute);
library.add(faSignal);
library.add(faSitemap);
library.add(faSync);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: window.location.hash.substr(1),
      pages: {
        neighbors: { title: "Neighbors", icon: neighbors },
        router_settings: { title: "Router Settings", icon: router },
        network_settings: { title: "Network Settings", icon: network },
        payments: { title: "Payments", icon: payments }
      }
    };
  }

  componentDidMount() {
    this.onHashChange();
    window.addEventListener("hashchange", this.onHashChange, false);
  }

  onHashChange = () => {
    let page = window.location.hash.substr(1);
    this.setState({ current: page });
    actions.changePage(page);
  };

  render() {
    let { current, pages } = this.state;
    let container = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    };

    let main = {
      width: "100%",
      maxWidth: 750,
      padding: 10
    };

    return (
      <div className="App">
        <AltheaNav pages={pages} current={current} />
        <div style={container}>
          <div style={main}>
            <Page />
          </div>
        </div>
      </div>
    );
  }
}

const Page = connect(["page"])(({ state }) => {
  switch (state.page) {
    case "router-settings":
      return <RouterSettings />;
    case "network-settings":
      return <NetworkSettings />;
    case "neighbors":
      return <Neighbors />;
    case "payments":
      return <Payments />;
    default:
      return <Frontpage />;
  }
});

export default App;
