import React from "react";
import { useTranslation } from "react-i18next";
import { NavItem, NavLink } from "reactstrap";

const padded = { paddingLeft: 5, paddingRight: 5 };

const AltheaNav = ({ current }) => {
  let [t] = useTranslation();

  let pages = {
    dashboard: { title: t("dashboard") },
    router_settings: { title: t("wifiAndPorts") },
    network_settings: { title: t("networkConnection") },
    billing: { title: t("billing") },
    payments: { title: t("paymentSettings") },
    advanced: { title: t("advancedSettings") }
  };

  let navItems = Object.keys(pages).map((p, i) => {
    let path = p.replace("_", "-");
    let active = path === current ? "active" : null;
    let { title } = pages[p];

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
