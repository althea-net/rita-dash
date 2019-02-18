import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from "reactstrap";

const languages = {
  "en-GB": "English",
  en: "English",
  es: "Español",
  fr: "Français"
};

const toggleStyles = {
  background: "#E5E5E5",
  border: "none",
  color: "#969DA0",
  paddingRight: 30
};

export default () => {
  let [, i18n] = useTranslation();
  let [open, setOpen] = useState(false);
  let toggle = () => setOpen(!open);

  return (
    <ButtonDropdown
      isOpen={open}
      toggle={toggle}
      className="ml-auto d-none d-sm-block mr-4 my-auto"
    >
      <DropdownToggle className="dropdown-toggle" caret style={toggleStyles}>
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
  );
};
