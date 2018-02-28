import React, { Component } from "react";
import Frontpage from "./Frontpage.js";
import Payments from "./Payments.js";
import Neighbors from "./Neighbors.js";
import WiFiSettings from "./WiFiSettings.js";
import { Nav, Navbar, NavbarBrand, NavItem, NavLink } from "reactstrap";
import { fetchUciConfigs } from "../actions";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: window.location.hash.substr(1)
    };

    this.setters = this.props.store.setters;
  }

  componentDidMount() {
    this.onHashChange();
    window.addEventListener("hashchange", this.onHashChange, false);
    // fetchUciConfigs(this.store);
  }

  onHashChange = () => this.setters.changePage(window.location.hash.substr(1));

  render() {
    return (
      <div className="App">
        <Navbar color="faded" light expand="md">
          <NavbarBrand href="/"> Althea</NavbarBrand>
          <Nav>
            <NavItem>
              <NavLink href="/#wifi-settings">WiFi Settings</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/#payments">Payments</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/#neighbors">Neighbors</NavLink>
            </NavItem>
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
            <Page store={this.props.store} />
          </div>
        </div>
      </div>
    );
  }
}

function Page({ store }) {
  switch (store.state.page) {
    case "wifi-settings":
      return <WiFiSettings store={store} />;
    case "payments":
      return <Payments store={store} />;
    case "neighbors":
      return <Neighbors store={store} />;
    default:
      return <Frontpage />;
  }
}

export default App;
