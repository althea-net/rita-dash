import React, { useEffect, useState } from "react";
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler } from "reactstrap";
import logo from "images/althea.png";
import AltheaNav from "./Nav";
import LanguageSelector from "./LanguageSelector";
import LowBalance from "utils/LowBalance";
import { get } from "store";
import { useStateValue } from "store/App";

const logoStyles = { width: 50, height: 50, marginLeft: 10, marginRight: 20 };

const Topbar = () => {
  let [open, setOpen] = useState(false);
  let toggle = () => setOpen(!open);
  let [, dispatch] = useStateValue();

  useEffect(
    () => {
      const getInfo = async () => {
        try {
          const info = await get("/info", true, 2000);
          dispatch({ type: "setBalance", balance: info.balance });
        } catch {}
      };

      window.addEventListener("hashchange", () => setOpen(false), false);
      getInfo();
    },
    [dispatch]
  );

  return (
    <Navbar
      color="white"
      light
      expand="lg"
      className="shadow-sm flex-wrap mb-0"
    >
      <div className="d-flex w-100">
        <NavbarBrand id="althea-home" href="#" className="d-flex my-auto">
          <img src={logo} alt="Althea Logo" style={logoStyles} />
          <h1 className="mb-0">Althea</h1>
        </NavbarBrand>
        <div className="ml-auto d-none d-lg-block mr-4 my-auto">
          <LanguageSelector />
        </div>
        <NavbarToggler className="ml-auto" onClick={toggle} />
      </div>
      <div className="d-flex">
        <Collapse isOpen={open}>
          <Nav navbar className="d-lg-none">
            <LanguageSelector />
            <AltheaNav />
          </Nav>
        </Collapse>
      </div>
      <LowBalance />
    </Navbar>
  );
};

export default Topbar;
