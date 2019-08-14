import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Tooltip } from "reactstrap";
import { get } from "store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";

import padlock from "../images/padlock.svg";

const BackupPrivateKey = () => {
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
        <div className="col-4 col-md-3 text-center my-auto">
          <img
            src={padlock}
            alt={t("padlockSymbol")}
            className="img-fluid"
            style={{ maxWidth: 80 }}
          />
        </div>
        <div className="col-8 col-md-9">
          <p>{t("backupText")}</p>
          {showing ? (
            <div class="d-flex flex-wrap">
              <div
                className="mb-2 col-9 mr-2"
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 5,
                  background: "#eee",
                  wordWrap: "break-word"
                }}
              >
                <div className="d-flex py-2 px-0">
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
              <Button color="primary" onClick={hideKey} style={{ height: 50 }}>
                {t("hide")}
              </Button>
            </div>
          ) : (
            <Button color="primary" onClick={showKey}>
              {t("showPrivateKey")}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default BackupPrivateKey;
