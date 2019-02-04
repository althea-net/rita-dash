import React, { Component } from "react";
import {
  ButtonDropdown,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler
} from "reactstrap";
import { actions } from "../store";
import logo from "../images/althea.png";
import { translate } from "react-i18next";
import AltheaNav from "./Nav";

const languages = {
  "en-GB": "English",
  en: "English",
  es: "Español",
  fr: "Français"
};

class Topbar extends Component {
  state = {
    open: false,
    dropOpen: false
  };

  componentDidMount() {
    actions.init(this.props.t);
  }

  drop = () => {
    this.setState({ dropOpen: !this.state.dropOpen });
  };

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    let { i18n } = this.props;
    let { dropOpen, open } = this.state;

    return (
      <Navbar color="white" light expand="sm" className="shadow-sm fixed-top">
        <div className="d-flex w-100">
          <NavbarBrand id="althea-home" href="#" className="d-flex my-auto">
            <img
              src={logo}
              alt="Althea Logo"
              style={{ width: 50, height: 50, marginLeft: 10, marginRight: 20 }}
            />
            <h1 className="mb-0">Althea</h1>
          </NavbarBrand>
          <ButtonDropdown
            isOpen={dropOpen}
            toggle={this.drop}
            className="ml-auto d-none d-sm-block mr-4 my-auto"
          >
            <DropdownToggle
              className="dropdown-toggle"
              caret
              style={{
                background: "#E5E5E5",
                border: "none",
                color: "#969DA0",
                paddingRight: 30
              }}
            >
              {languages[i18n.language]}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => i18n.changeLanguage("en")}>
                English
              </DropdownItem>
              <DropdownItem onClick={() => i18n.changeLanguage("es")}>
                Español
              </DropdownItem>
              <DropdownItem onClick={() => i18n.changeLanguage("fr")}>
                Français
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
          <NavbarToggler className="ml-auto" onClick={this.toggle} />
        </div>
        <div className="d-flex">
          <Collapse isOpen={open}>
            <Nav navbar className="d-sm-none">
              <AltheaNav />
            </Nav>
          </Collapse>
        </div>
      </Navbar>
    );
  }
}

export default translate()(Topbar);
