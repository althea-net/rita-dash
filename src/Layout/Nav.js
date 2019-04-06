import React from "react";
import { useTranslation } from "react-i18next";
import { NavItem, NavLink } from "reactstrap";

const padded = { paddingLeft: 5, paddingRight: 5 };

const AltheaNav = ({ page }) => {
  let [t] = useTranslation();

  let pages = {
    dashboard: t("dashboard"),
    router_settings: t("wifiAndPorts"),
    network_settings: t("networkConnection"),
    payments: t("paymentSettings"),
    advanced: t("advancedSettings")
  };

  let navItems = Object.keys(pages).map((p, i) => {
    let path = p.replace("_", "-");
    let active = path === page ? "active" : null;
    let title = pages[p];

    return { path, active, title };
  });

  return navItems.map((page, i) => {
    return (
      <NavItem style={padded} className={page.active} key={i}>
        <NavLink href={"#" + page.path} id={page.path}>
          {page.title}
        </NavLink>
      </NavItem>
    );
  });
};

export default AltheaNav;
