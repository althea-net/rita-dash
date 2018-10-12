import React, { Component } from "react";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { actions } from "../store";
import logo from "../images/althea.png";
import neighbors from "../images/neighbors.svg";
import network from "../images/network.svg";
import router from "../images/router.svg";
import payments from "../images/payments.svg";
import { translate } from "react-i18next";

class AltheaNav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    actions.init(this.props.t);
  }

  drop = () => {
    this.setState({ dropOpen: !this.state.dropOpen });
  };

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  navItems = () => {
    let { t } = this.props;
    let pages = {
      neighbors: { title: t("neighbors"), icon: neighbors },
      router_settings: { title: t("routerSettings"), icon: router },
      network_settings: { title: t("networkSettings"), icon: network },
      payments: { title: t("payments"), icon: payments }
    };

    return Object.keys(pages).map((p, i) => {
      let path = p.replace("_", "-");
      let active = path === this.props.current ? "active" : null;
      let { icon, title } = pages[p];

      return { path, active, title, icon };
    });
  };

  renderNavItems = () => {
    let padded = { paddingLeft: 5, paddingRight: 5 };
    return this.navItems().map((page, i) => {
      return (
        <NavItem style={padded} className={page.active} key={i}>
          <NavLink href={"#" + page.path} id={page.path}>
            <img src={page.icon} width="30" height="30" alt={page.title} />{" "}
            {page.title}
          </NavLink>
        </NavItem>
      );
    });
  };

  render() {
    let { i18n } = this.props;

    return (
      <Navbar color="light" light expand="sm">
        <NavbarToggler className="float-right" onClick={this.toggle} />
        <NavbarBrand id="althea-home" href="#">
          <img src={logo} width="60px" alt="Althea Logo" />
          Althea
        </NavbarBrand>
        <Collapse isOpen={this.state.open} navbar>
          <Nav navbar className="bg-light">
            {this.renderNavItems()}
          </Nav>
        </Collapse>
        <Nav>
          <NavLink>
            <ButtonDropdown isOpen={this.state.dropOpen} toggle={this.drop}>
              <DropdownToggle caret>
                <FontAwesomeIcon icon="globe-americas" size="lg" />
                &nbsp;
                {i18n.language.toUpperCase()}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => i18n.changeLanguage("en")}>
                  EN
                </DropdownItem>
                <DropdownItem onClick={() => i18n.changeLanguage("es")}>
                  ES
                </DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </NavLink>
        </Nav>
      </Navbar>
    );
  }
}

export default translate()(AltheaNav);
