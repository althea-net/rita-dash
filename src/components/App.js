import React, { Component } from "react";
import Frontpage from "./Frontpage.js";
import Neighbors from "./Neighbors.js";
import RouterSettings from "./RouterSettings.js";
import NetworkSettings from "./NetworkSettings.js";
import { Nav, Navbar, NavbarBrand, NavItem, NavLink } from "reactstrap";
import { actions, connect } from "../store";

class App extends Component {
  componentDidMount() {
    this.onHashChange();
    window.addEventListener("hashchange", this.onHashChange, false);
  }

  onHashChange = () => actions.changePage(window.location.hash.substr(1));

  render() {
    return (
      <div className="App">
        <Navbar color="faded" light expand="md">
          <NavbarBrand href="#"> Althea</NavbarBrand>
          <Nav>
            <NavItem>
              <NavLink href="#neighbors">Neighbors</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#router-settings">Router Settings</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#network-settings">Network Settings</NavLink>
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
    default:
      return <Frontpage />;
  }
});

export default App;
