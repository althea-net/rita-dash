import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import { Address4 } from "ip-address";

const WANConfig = ({ open, setOpen, setMode, setConfirming }) => {
  const [t] = useTranslation();
  const [type, setType] = useState("dynamic");

  const [ipaddr, setIpaddr] = useState("");
  const [netmask, setNetmask] = useState("");
  const [gateway, setGateway] = useState("");

  const addrIp = new Address4(ipaddr || "");
  const netmaskIp = new Address4(netmask || "");
  const gatewayIp = new Address4(gateway || "");

  const ipEl = useRef(null);

  const toggle = () => setOpen(!open);
  const toggleType = () => {
    type === "dynamic" ? setType("static") : setType("dynamic");
  };

  useEffect(
    () => {
      if (ipEl.current) ipEl.current.focus();
      return;
    },
    [type]
  );

  const submit = async e => {
    e.preventDefault();
    setMode("Wan");
    if (type === "static") setMode({ StaticWan: { ipaddr, netmask, gateway } });
    toggle();
    setConfirming(true);
  };

  const disabled =
    type === "static" &&
    !(addrIp.isValid() && gatewayIp.isValid() && netmaskIp.isValid());

  return (
    <Modal size="lg" isOpen={open} centered toggle={toggle}>
      <ModalHeader>{t("configureWAN")}</ModalHeader>
      <ModalBody>
        <Form onSubmit={submit} className="mt-lg-2 w-100">
          <div className="d-flex flex-wrap w-100 justify-content-center">
            <FormGroup className="d-flex align-items-center mr-2">
              <input
                id="dynamic"
                type="radio"
                onChange={toggleType}
                name="type"
                value="dynamic"
                checked={type === "dynamic"}
                className="mr-1"
              />
              <label htmlFor="dynamic">{t("dynamic")}</label>
            </FormGroup>

            <FormGroup className="d-flex align-items-center">
              <input
                id="static"
                type="radio"
                name="type"
                value="static"
                onChange={toggleType}
                checked={type === "static"}
                className="mr-1"
              />
              <label htmlFor="static">{t("static")}</label>
            </FormGroup>
          </div>

          {type === "static" && (
            <>
              <FormGroup>
                <Label>{t("ipAddress")}</Label>
                <Input
                  innerRef={ipEl}
                  value={ipaddr}
                  onChange={e => setIpaddr(e.target.value)}
                  valid={addrIp.isValid()}
                  invalid={!!(ipaddr && !addrIp.isValid())}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t("netmask")}</Label>
                <Input
                  value={netmask}
                  onChange={e => setNetmask(e.target.value)}
                  valid={netmaskIp.isValid()}
                  invalid={!!(netmask && !netmaskIp.isValid())}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t("gateway")}</Label>
                <Input
                  value={gateway}
                  onChange={e => setGateway(e.target.value)}
                  valid={gatewayIp.isValid()}
                  invalid={!!(gateway && !gatewayIp.isValid())}
                />
              </FormGroup>
            </>
          )}

          <Button
            color="primary"
            className="ml-auto float-right"
            disabled={disabled}
          >
            {t("next")}
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default WANConfig;
