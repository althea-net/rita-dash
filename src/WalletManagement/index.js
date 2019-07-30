import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import { get } from "store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";

import padlock from "../images/padlock.svg";
import refresh from "../images/refresh.svg";

export default ({ open, setOpen }) => {
  const [t] = useTranslation();
  const [privateKey, setPrivateKey] = useState("");
  const [newPrivateKey, setNewPrivateKey] = useState("");
  const [showing, setShowing] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => setCopied(true);

  let init = async () => {
    let { ethPrivateKey } = await get("/eth_private_key");
    setPrivateKey(ethPrivateKey);
  };

  const hideKey = () => {
    setCopied(false);
    setShowing(false);
  };
  const showKey = () => setShowing(true);

  const valid = parseInt(newPrivateKey, 16) > 0;

  return (
    <Modal
      isOpen={open}
      size="lg"
      centered
      toggle={() => setOpen(!open)}
      onOpened={init}
    >
      <ModalHeader>{t("walletManagement")}</ModalHeader>
      <ModalBody>
        <p>{t("altheaUses")}</p>
        <h6>{t("backupAccount")}</h6>
        <div className="d-flex mb-4 mt-3">
          <div className="col-3 text-center my-auto">
            <img src={padlock} alt={t("padlockSymbol")} height={110} />
          </div>
          <div>
            <p>{t("backupYourAccount")}</p>
            {showing ? (
              <div className="d-flex">
                <InputGroup className="mr-2">
                  <Input
                    type="textarea"
                    readOnly
                    id="currentKey"
                    name="privateKey"
                    onChange={e => setNewPrivateKey(e.target.value)}
                    value={privateKey}
                  />
                  <CopyToClipboard text={privateKey} onCopy={copy}>
                    <InputGroupAddon addonType="append">
                      <InputGroupText
                        style={{ cursor: "pointer" }}
                        id="copySubnetAddr"
                      >
                        <FontAwesomeIcon icon="copy" />
                      </InputGroupText>
                    </InputGroupAddon>
                  </CopyToClipboard>
                </InputGroup>
                <Button color="primary" onClick={hideKey}>
                  {t("hide")}
                </Button>
              </div>
            ) : (
              <Button color="primary" onClick={showKey}>
                {t("showPrivateKey")}
              </Button>
            )}
            {copied && <p>{t("copied")}</p>}
          </div>
        </div>
        <h6>{t("replaceAccount")}</h6>
        <div className="d-flex mt-2">
          <div className="col-3 text-center my-auto">
            <img src={refresh} alt={t("refreshSymbol")} />
          </div>
          <div>
            <p className="mb-0">{t("ifYouWant")}</p>
            <FormGroup>
              <Label for="privateKey">{t("newPrivateKey")}</Label>
              <div className="d-flex">
                <Input
                  className="mr-3"
                  id="privateKey"
                  name="privateKey"
                  onChange={e => setPrivateKey(e.target.value)}
                  value={newPrivateKey}
                  style={{ width: 350 }}
                />
                <Button
                  color="primary"
                  style={{ width: 100 }}
                  disabled={!valid}
                >
                  {t("import")}
                </Button>
              </div>
            </FormGroup>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
