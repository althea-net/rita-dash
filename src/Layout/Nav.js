import React from "react";
import { useTranslation } from "react-i18next";
import { NavItem, NavLink } from "reactstrap";
import { useStore } from "store";

const padded = { paddingLeft: 5, paddingRight: 5 };

const AltheaNav = ({ page, setOpen }) => {
  let [t] = useTranslation();
  const [{ sellingBandwidth }] = useStore();

  let pages = {
    dashboard: t("dashboard"),
    "router-settings": t("wifiAndPorts"),
    finances: t("finances"),
    "selling-bandwidth": t("sellingBandwidth"),
    settings: t("settings"),
    advanced: t("advanced")
  };

  let navItems = Object.keys(pages).map((path, i) => {
    let active = path === page ? "active" : null;
    let title = pages[path];

    return { path, active, title };
  });

  return navItems.map((page, i) => {
    if (page.path === "selling-bandwidth" && !sellingBandwidth) return null;

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
