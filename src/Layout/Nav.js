import React from "react";
import { useTranslation } from "react-i18next";
import { NavItem, NavLink } from "reactstrap";

const padded = { paddingLeft: 5, paddingRight: 5 };

const AltheaNav = ({ page, setOpen }) => {
  let [t] = useTranslation();

  let pages = {
    dashboard: t("dashboard"),
    "router-settings": t("wifiAndPorts"),
    finances: t("finances"),
    "selling-bandwidth": t("sellingBandwidth"),
    settings: t("settings"),
    advanced: t("advanced"),
    devices: t("devices"),
    network: t("networkSettings"),
  };

  let navItems = Object.keys(pages).map((path) => {
    let active = path === page ? "active" : null;
    let title = pages[path];

    return { path, active, title };
  });

  return navItems.map((page, i) => {
    return (
      <NavItem style={padded} className={page.active} key={i}>
        <NavLink
          href={"#" + page.path}
          id={page.path}
          onClick={() => setOpen(false)}
        >
          {page.title}
        </NavLink>
      </NavItem>
    );
  });
};

export default AltheaNav;
