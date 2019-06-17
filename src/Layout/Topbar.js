import React from "react";
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler } from "reactstrap";
import AltheaNav from "./Nav";
import LanguageSelector from "./LanguageSelector";
import LowBalance from "utils/LowBalance";

const Topbar = ({ open, setOpen }) => {
  let toggle = () => setOpen(!open);

  return (
    <Navbar
      color="white"
      light
      expand="lg"
      className="shadow-sm flex-wrap mb-0"
    >
      <div className="d-flex w-100">
        <NavbarBrand id="althea-home" href="#" className="d-flex my-auto">
          Althea
        </NavbarBrand>
        <div className="ml-auto d-none d-lg-block mr-4 my-auto">
          <LanguageSelector />
        </div>
        <NavbarToggler className="ml-auto" onClick={toggle} />
      </div>
      <div className="d-flex w-100">
        <Collapse isOpen={open} timeout={0} className="w-100">
          <Nav navbar className="d-lg-none">
            <div className="d-flex">
              <div>
                <AltheaNav setOpen={setOpen} />
              </div>
              <div className="ml-auto mt-auto mb-2 mr-0">
                <LanguageSelector />
              </div>
            </div>
          </Nav>
        </Collapse>
      </div>
      <LowBalance />
    </Navbar>
  );
};

export default Topbar;
