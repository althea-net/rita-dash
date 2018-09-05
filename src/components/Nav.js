import React, { Component } from "react";
import {
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink
} from "reactstrap";
import logo from "../images/althea.png";

class AltheaNav extends Component {
  state = {};

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  navItems = () => {
    return Object.keys(this.props.pages).map((p, i) => {
      let path = p.replace("_", "-");
      let active = path === this.props.current ? "active" : null;
      let { icon, title } = this.props.pages[p];

      return { path, active, title, icon };
    });
  };

  renderNavItems = () => {
    let padded = { paddingLeft: 5, paddingRight: 5 };
    console.log(this.navItems());
    return this.navItems().map((page, i) => {
      return (
        <NavItem style={padded} className={page.active} key={i}>
          <NavLink href={"#" + page.path}>
            <img src={page.icon} width="30" height="30" alt={page.title} />{" "}
            {page.title}
          </NavLink>
        </NavItem>
      );
    });
  };

  render() {
    return (
      <Navbar color="light" light expand="sm">
        <NavbarToggler className="float-right" onClick={this.toggle} />
        <NavbarBrand href="#">
          <img src={logo} width="60px" alt="Althea Logo" />
          Althea
        </NavbarBrand>
        <Collapse isOpen={this.state.open} navbar>
          <Nav navbar className="bg-light">
            {this.renderNavItems()}
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default AltheaNav;
