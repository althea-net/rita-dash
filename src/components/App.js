import React, { Component } from "react";
import Frontpage from "./Frontpage.js";
import Neighbors from "./Neighbors.js";
import RouterSettings from "./RouterSettings.js";
import NetworkSettings from "./NetworkSettings.js";
import Payments from "./Payments.js";
import { Nav, Navbar, NavbarBrand, NavItem, NavLink } from "reactstrap";
import { actions, connect } from "../store";
import logo from "../images/althea.png";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBan,
  faRoute,
  faSignal,
  faSitemap,
  faSync
} from "@fortawesome/free-solid-svg-icons";

library.add(faBan);
library.add(faRoute);
library.add(faSignal);
library.add(faSitemap);
library.add(faSync);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: window.location.hash.substr(1),
      pages: {
        neighbors: "Neighbors",
        router_settings: "Router Settings",
        network_settings: "Network Settings",
        payments: "Payments"
      }
    };
    this.onHashChange = this.onHashChange.bind(this);
  }

  componentDidMount() {
    this.onHashChange();
    window.addEventListener("hashchange", this.onHashChange, false);
  }

  onHashChange() {
    let page = window.location.hash.substr(1);
    this.setState({ current_page: page });
    actions.changePage(page);
  }

  render() {
    return (
      <div className="App">
        <Navbar color="primary" dark expand="md">
          <NavbarBrand href="#">
            <img src={logo} width="60px" alt="Althea Logo" />
            Althea
          </NavbarBrand>
          <Nav className="bg-light">
            {Object.keys(this.state.pages).map((p, i) => {
              let page = p.replace("_", "-");
              let current_page = this.state.current_page;
              let title = this.state.pages[p];
              return (
                <NavItem
                  className={page === current_page ? "active" : null}
                  key={i}
                >
                  <NavLink href={"#" + page}>{title}</NavLink>
                </NavItem>
              );
            })}
          </Nav>
        </Navbar>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 750,
              padding: 10
            }}
          >
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
