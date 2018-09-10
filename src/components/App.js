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
  faGlobeAmericas,
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
import { translate } from "react-i18next";

library.add(faBan);
library.add(faGlobeAmericas);
library.add(faMinusCircle);
library.add(faRoute);
library.add(faSignal);
library.add(faSitemap);
library.add(faSync);

class App extends Component {
  constructor(props) {
    super(props);
    let { t } = props;
    this.state = {
      current: window.location.hash.substr(1),
      pages: {
        neighbors: { title: t("neighbors"), icon: neighbors },
        router_settings: { title: t("routerSettings"), icon: router },
        network_settings: { title: t("networkSettings"), icon: network },
        payments: { title: t("payments"), icon: payments }
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

    const { i18n, t } = this.props;

    return (
      <div className="App">
        <AltheaNav pages={pages} current={current} i18n={i18n} t={t} />
        <div style={container}>
          <div style={main}>
            <Page t={t} />
          </div>
        </div>
      </div>
    );
  }
}

const Page = connect(["page"])(({ state, t }) => {
  switch (state.page) {
    case "router-settings":
      return <RouterSettings t={t} />;
    case "network-settings":
      return <NetworkSettings t={t} />;
    case "neighbors":
      return <Neighbors t={t} />;
    case "payments":
      return <Payments t={t} />;
    default:
      return <Frontpage t={t} />;
  }
});

export default translate("translations")(App);
