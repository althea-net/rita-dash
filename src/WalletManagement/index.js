import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import padlock from "../images/padlock.svg";
import refresh from "../images/refresh.svg";

export default ({ open, setOpen }) => {
  const [t] = useTranslation();
  const [privateKey, setPrivateKey] = useState("");
  const showKey = () => {};
  const valid = parseInt(privateKey, 16) > 0;

  return (
    <Modal isOpen={open} size="lg" centered toggle={() => setOpen(!open)}>
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
            <Button color="primary" onClick={showKey}>
              {t("showPrivateKey")}
            </Button>
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
                  value={privateKey}
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
