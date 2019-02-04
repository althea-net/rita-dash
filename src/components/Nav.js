import React, { Component } from "react";
import { NavItem, NavLink } from "reactstrap";
import { translate } from "react-i18next";

class AltheaNav extends Component {
  navItems = () => {
    let { t } = this.props;
    let pages = {
      neighbors: { title: t("neighbors") },
      router_settings: { title: t("routerSettings") },
      network_settings: { title: t("networkSettings") },
      payments: { title: t("payments") }
    };

    return Object.keys(pages).map((p, i) => {
      let path = p.replace("_", "-");
      let active = path === this.props.current ? "active" : null;
      let { title } = pages[p];

      return { path, active, title };
    });
  };

  render() {
    let padded = { paddingLeft: 5, paddingRight: 5 };
    return this.navItems().map((page, i) => {
      return (
        <NavItem style={padded} className={page.active} key={i}>
          <NavLink href={"#" + page.path} id={page.path}>
            {page.title}
          </NavLink>
        </NavItem>
      );
    });
  }
}

export default translate()(AltheaNav);
