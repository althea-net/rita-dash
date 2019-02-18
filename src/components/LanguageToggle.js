import React from "react";
import {
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from "reactstrap";

export default () => {

  drop = () => {
    this.setState({ dropOpen: !this.state.dropOpen });
  };


  return (
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
  </ButtonDropdown>;
  )
};
