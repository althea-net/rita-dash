import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Tooltip
} from "reactstrap";
import { get, post, useStore } from "store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";

import padlock from "./images/padlock.svg";

const AbortController = window.AbortController;

export default ({ open, setOpen }) => {
  const [t] = useTranslation();
  const [privateKey, setPrivateKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [, dispatch] = useStore();

  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    (async () => {
      try {
        const { ethPrivateKey } = await get(
          "/eth_private_key",
          true,
          5000,
          signal
        );
        if (!(ethPrivateKey instanceof Error)) setPrivateKey(ethPrivateKey);
      } catch (e) {
        if (e.message && e.message.includes("aborted")) return;
        console.log(e);
      }
    })();
    return () => controller.abort();
  }, []);

  const done = () => {
    post("/backup_created/true");
    dispatch({ type: "backupCreated", backupCreated: true });
    setOpen(false);
  };

  return (
    <Modal isOpen={open} size="sm" centered toggle={() => setOpen(!open)}>
      <ModalHeader toggle={() => setOpen(!open)}>
        {t("backupAccount")}
      </ModalHeader>
      <ModalBody>
        <div className="text-center">
          <img
            src={padlock}
            alt={t("padlockSymbol")}
            className="img-fluid my-3"
            style={{ maxWidth: 60 }}
          />
          <h6 className="mb-3">{t("backupYourAccount")}</h6>
          <p>{t("backupTextShort")}</p>
        </div>
        <Label>{t("yourPrivateKey")}</Label>
        <div
          className="card p-2 mb-4"
          style={{ border: "1px solid #ddd", background: "#eee" }}
        >
          <div className="d-flex">
            <div className="col-11">{privateKey}</div>

            <Tooltip placement="top" isOpen={copied} target="copy">
              {t("copied")}
            </Tooltip>
            <CopyToClipboard text={privateKey} onCopy={copy}>
              <FontAwesomeIcon
                id="copy"
                icon="copy"
                color="#999"
                className="mr-2"
                style={{ cursor: "pointer" }}
              />
            </CopyToClipboard>
          </div>
        </div>
        <Button color="primary" onClick={done} className="w-100">
          <b>{t("doneBackingUp")}</b>
        </Button>
      </ModalBody>
    </Modal>
  );
};
