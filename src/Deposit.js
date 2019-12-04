import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal, ModalHeader, ModalBody, Tooltip } from "reactstrap";
import QR from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { get, useStore } from "store";
import { toEth } from "utils";

const qrStyle = { height: "auto", width: "80%" };

const Deposit = ({ open, setOpen }) => {
  const [t] = useTranslation();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [depositing, setDepositing] = useState(false);
  const [wyreEnabled, setWyreEnabled] = useState(false);
  const [wyreAccountId, setWyreAccountId] = useState();

  const [
    { address, debt, lowBalance, status, withdrawChainSymbol }
  ] = useStore();

  const getWyreEnabled = useCallback(async signal => {
    try {
      const { wyreEnabled, wyreAccountId } = await get("/localization", true, 5000, signal)
      setWyreEnabled(wyreEnabled);
      setWyreAccountId(wyreAccountId);
      if (!(wyreEnabled && withdrawChainSymbol === "ETH")) setDepositing(true);
    } catch {}

    setLoading(false);
  }, [withdrawChainSymbol]);

  useEffect(
    () => {
      const controller = new AbortController();
      const signal = controller.signal;

      (async () => {
        setLoading(true);
        await getWyreEnabled(signal);
        setLoading(false);
      })();

      return () => controller.abort();
    },
    [getWyreEnabled]
  );

  let minDeposit = toEth(debt) * 2;
  if (status) minDeposit = Math.max(status.minEth, minDeposit);

  const recommendedDeposit = `${minDeposit} ${withdrawChainSymbol}`;

  if (!(address && withdrawChainSymbol)) return null;

  const toggle = () => {
    setOpen(!open);
    setDepositing(false);
  } 

  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={open && !loading} size="sm" centered toggle={toggle}>
      <ModalHeader>{t("addFunds")}</ModalHeader>
      <ModalBody>
        {wyreEnabled &&
          withdrawChainSymbol === "ETH" && (
            <>
              <Button
                href={
                  "https://pay.sendwyre.com/purchase" +
                  `?dest=${address}` +
                  "&destCurrency=ETH" +
                  `&account_id=${wyreAccountId}` +
                  `&redirectUrl=${
                    window.isMobile ? "althea://" : window.location.href
                  }`
                }
                color="primary"
                className="w-100 mb-2"
              >
                {t("buy")} ETH
              </Button>

              {depositing || (
                <Button
                  color="primary"
                  className="w-100 mb-2"
                  onClick={() => setDepositing(true)}
                >
                  {t("deposit")} {withdrawChainSymbol}
                </Button>
              )}
            </>
          )}

        {depositing && (
          <>
            <div
              className="mb-4 shadow-none d-flex flex-wrap"
              style={{
                border: "1px solid #ddd",
                borderRadius: 5,
                wordWrap: "break-word"
              }}
            >
              <div className="d-flex py-2 px-0 w-100">
                <div className="col-11" id="walletAddr">
                  {address}
                </div>

                <Tooltip placement="top" isOpen={copied} target="copy">
                  {t("copied")}
                </Tooltip>
                <CopyToClipboard text={address} onCopy={copy}>
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
            <div className="w-100 text-center mb-4">
              <QR style={qrStyle} value={address} />
            </div>
          </>
        )}
        <div>
          {lowBalance &&
            minDeposit > 0 &&
            t("recommendedDeposit", { recommendedDeposit })}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default Deposit;
