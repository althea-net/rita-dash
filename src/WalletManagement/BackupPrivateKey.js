import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import { get } from "store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";

import padlock from "../images/padlock.svg";

export default ({ open, setOpen }) => {
  const [t] = useTranslation();
  const [privateKey, setPrivateKey] = useState("");
  const [showing, setShowing] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => setCopied(true);

  useEffect(() => {
    (async () => {
      try {
        const { ethPrivateKey } = await get("/eth_private_key");
        if (!(ethPrivateKey instanceof Error)) setPrivateKey(ethPrivateKey);
      } catch (e) {
        console.log(e);
      }
    })();
    return;
  }, []);

  const hideKey = () => {
    setCopied(false);
    setShowing(false);
  };
  const showKey = () => setShowing(true);

  return (
    <>
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
    </>
  );
};
