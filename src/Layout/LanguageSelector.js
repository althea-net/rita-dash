import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from "reactstrap";

const languages = {
  en: "English",
  es: "Español",
  fr: "Français"
};

const toggleStyles = {
  background: "#E5E5E5",
  border: "none",
  color: "#666",
  paddingRight: 30,
  fontWeight: "normal"
};

export default () => {
  let [, i18n] = useTranslation();
  let [open, setOpen] = useState(false);
  let toggle = () => setOpen(!open);

  return (
    <ButtonDropdown isOpen={open} toggle={toggle}>
      <DropdownToggle
        className="dropdown-toggle"
        caret
        style={toggleStyles}
        id="langDropDown"
      >
        {languages[i18n.language] || languages["en"]}
      </DropdownToggle>
      <DropdownMenu>
        {Object.keys(languages).map(lang => (
          <DropdownItem
            key={lang}
            onClick={() => i18n.changeLanguage(lang)}
            id={lang}
          >
            {languages[lang]}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </ButtonDropdown>
  );
};
