import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Tooltip,
  Input,
} from "reactstrap";
import QR from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { get, useStore } from "store";
import { toEth } from "utils";
import { symbol } from "prop-types";

const qrStyle = { height: "auto", width: "80%" };

const Deposit = ({ open, setOpen }) => {
  const [t] = useTranslation();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [depositing, setDepositing] = useState(true);
  const [wyreEnabled, setWyreEnabled] = useState(false);
  const [operatorDebt, setOperatorDebt] = useState(0);
  const [wyreAccountId, setWyreAccountId] = useState();
  const [wyreWarningModal, setWyreWarningModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [supportNumber, setSupportNumber] = useState("");

  const [
    { address, debt, lowBalance, status, withdrawChainSymbol, symbol },
  ] = useStore();

  const getWyreEnabled = useCallback(
    async (signal) => {
      try {
        const { wyreEnabled, wyreAccountId, supportNumber } = await get(
          "/localization",
          true,
          5000,
          signal
        );
        setWyreEnabled(wyreEnabled);
        setWyreAccountId(wyreAccountId);
        setSupportNumber(supportNumber);
        if (wyreEnabled && withdrawChainSymbol === "ETH") setDepositing(false);
      } catch {}

      setLoading(false);
    },
    [withdrawChainSymbol]
  );

  useEffect(
    () => {
      const controller = new AbortController();
      const signal = controller.signal;

      (async () => {
        let operatorDebt = await get("/operator_debt");
        let phone = await get("/phone");
        if (!(phone instanceof Error)) setPhone(phone);
        if (!(operatorDebt instanceof Error)) setOperatorDebt(operatorDebt);

        setLoading(true);
        await getWyreEnabled(signal);
        setLoading(false);
      })();

      return () => controller.abort();
    },
    [getWyreEnabled]
  );

  let decimals = symbol === "Dai" ? 2 : 4;
  let minDeposit = toEth(debt, decimals) * 2 + toEth(operatorDebt, decimals);
  if (status) minDeposit = Math.max(status.minEth, minDeposit);

  const recommendedDeposit = `${minDeposit} ${symbol}`;

  if (!(address && withdrawChainSymbol)) return null;

  const toggle = () => {
    setOpen(!open);
    if (wyreEnabled && withdrawChainSymbol === "ETH") setDepositing(false);
  };

  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateContact = () => {
    window.location.href = "#settings";
    let scroll = () => {
      let el = document.getElementById("notifications");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else setTimeout(scroll, 100);
    };
    scroll();
  };

  let frontpage;
  let wyre_deposit_error_page;
  if (window.isMobile) {
    frontpage = "althea://";
    wyre_deposit_error_page = "althea://";
  } else {
    frontpage = "http://192.168.10.1";
    wyre_deposit_error_page = "http://192.168.10.1/";
  }

  let modal_body;
  let modal_header = t("addFunds");

  // the modal size, edited for when a message case needs a larger modal
  let size = "sm";
  if (wyreEnabled && withdrawChainSymbol === "ETH" && !wyreWarningModal) {
    modal_body = (
      <>
        <Button
          color="primary"
          className="w-100 mb-2"
          onClick={() => setWyreWarningModal(true)}
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

        <div>
          {lowBalance &&
            minDeposit > 0 &&
            t("recommendedDeposit", { recommendedDeposit })}
        </div>
      </>
    );
  } else if (wyreEnabled && withdrawChainSymbol === "ETH" && wyreWarningModal) {
    size = "lg";

    modal_body = (
      <>
        <div>
          {phone ? t("wyreNumberHelp") : t("wyreNumberHelpNoExample")}
          {phone ? <Input id="phone" readOnly value={phone || ""} /> : <></>}
          {phone ? (
            <>
              {t("wyreNumberChange")}
              <a href="#settings" onClick={updateContact}>
                {"here"}
              </a>
            </>
          ) : (
            <></>
          )}
        </div>
        <br />
        <div>{t("wyreInternational")}</div>
        <br />
        <div>{t("wyreSupport", { supportNumber })}</div>
        <hr />
        <Button
          href={
            "https://pay.sendwyre.com/purchase" +
            `?dest=${address}` +
            "&destCurrency=ETH" +
            `&accountId=${wyreAccountId}` +
            `&redirectUrl=${frontpage}` +
            `&failureRedirectUrl=${wyre_deposit_error_page}`
          }
          color="primary"
          className="w-25 mb-2"
        >
          {t("continueToWyre")}
        </Button>
      </>
    );
  } else {
    modal_body = (
      <>
        <div
          className="mb-4 shadow-none d-flex flex-wrap"
          style={{
            border: "1px solid #ddd",
            borderRadius: 5,
            wordWrap: "break-word",
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

        <div>
          {lowBalance &&
            minDeposit > 0 &&
            t("recommendedDeposit", { recommendedDeposit })}
        </div>
      </>
    );
  }
  return (
    <Modal
      isOpen={open && !loading}
      // this resets the wyre warning modal flow
      // the flow goes, depositing true -> false
      // which shows the selection modal if appropriate
      // if you show the selection modal once wyreWarningModal
      // is set to true it shows the final warning page then
      // the user exits.
      // both warning modal and depositing are reset here
      onClosed={() => {
        setWyreWarningModal(false);
        setDepositing(false);
      }}
      size={size}
      centered
      toggle={toggle}
    >
      <ModalHeader>{modal_header}</ModalHeader>
      <ModalBody>{modal_body}</ModalBody>
    </Modal>
  );
};

export default Deposit;
