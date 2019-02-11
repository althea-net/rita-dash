import React, { Component } from "react";
import { Nav } from "reactstrap";
import Sidebar from "./Sidebar";
import AltheaNav from "./Nav";
import Topbar from "./Topbar";
import {
  Billing,
  Frontpage,
  Neighbors,
  RouterSettings,
  NetworkSettings,
  Payments
} from "../pages";
import NoConnection from "./NoConnection";
import CameraUI from "./CameraUI";
import { actions, connect } from "../store";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBan,
  faGlobeAmericas,
  faMinusCircle,
  faAngleRight,
  faCheckCircle,
  faQrcode,
  faRoute,
  faSignal,
  faSitemap,
  faSync
} from "@fortawesome/free-solid-svg-icons";

library.add(faBan);
library.add(faGlobeAmericas);
library.add(faMinusCircle);
library.add(faAngleRight);
library.add(faCheckCircle);
library.add(faRoute);
library.add(faQrcode);
library.add(faSignal);
library.add(faSitemap);
library.add(faSync);

class App extends Component {
  state = {
    current: window.location.hash.substr(1)
  };

  componentDidMount() {
    this.onHashChange();
    window.addEventListener("hashchange", this.onHashChange, false);
    actions.getBlockchain();
    actions.getSettings();
    actions.getInfo();
    actions.getVersion();
    this.versionTimer = setInterval(actions.getVersion, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.versionTimer);
  }

  onHashChange = () => {
    let page = window.location.hash.substr(1);
    this.setState({ current: page });
    actions.changePage(page);
  };

  render() {
    let { current } = this.state;

    let main = {
      width: "100%",
      maxWidth: 800,
      padding: 10
    };

    return (
      <React.Fragment>
        <div className="App">
          <Topbar />
          <Sidebar>
            <Nav id="sidebar" navbar>
              <AltheaNav current={current} />
            </Nav>
            <NoConnection />
            <div style={main}>
              <Page page={current} />
            </div>
          </Sidebar>
        </div>
        <CameraUI />
      </React.Fragment>
    );
  }
}

const Page = connect(["page"])(({ page, state, t }) => {
  switch (page) {
    case "advanced":
      return <Neighbors />;
    case "router-settings":
      return <RouterSettings />;
    case "network-settings":
      return <NetworkSettings />;
    case "neighbors":
      return <Neighbors />;
    case "billing":
      return <Billing />;
    case "payments":
      return <Payments />;
    case "dashboard":
    default:
      return <Frontpage />;
  }
});

export default App;
