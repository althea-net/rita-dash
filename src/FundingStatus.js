import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStore } from "store";
import WithdrawAll from "./WithdrawAll";
import clock from "./images/clock.svg";

const FundingStatus = () => {
  const [t] = useTranslation();
  const [withdrawing, setWithdrawing] = useState(false);
  const [waitingForXdai, setWaitingForXdai] = useState(false);
  const [{ status }] = useStore();

  const { key, reserve, minEth, minDai, requiredEth, dai, eth, dest } = status;

  useEffect(
    () => {
      let timer;
      if (key === "daiToXdai") {
        setWaitingForXdai(true);
        timer = setTimeout(() => setWaitingForXdai(false), 120000);
      }
      return () => {
        if (key === "noOp") clearTimeout(timer);
      };
    },
    [key, waitingForXdai]
  );

  const withdraw = e => {
    e.preventDefault();
    setWithdrawing(true);
  };

  if (!(eth && reserve)) return null;

  return (
    <div className="mt-2">
      <WithdrawAll open={withdrawing} setOpen={setWithdrawing} />
      {key === "noOp" &&
        (waitingForXdai ? (
          <div className="d-flex w-100">
            <img src={clock} alt={t("clock")} className="mr-2" />
            {
              <div
                dangerouslySetInnerHTML={{
                  __html: t("fundsAdded")
                }}
              />
            }
          </div>
        ) : (
          eth > reserve && (
            <div className="d-flex mt-2">
              <FontAwesomeIcon
                icon="exclamation-triangle"
                color="black"
                className="mr-2"
                style={{ cursor: "pointer", marginTop: 3 }}
              />
              <div>
                <p className="mb-0">
                  <b style={{ color: "black" }}>{t("notEnoughFunds")}</b>
                </p>
                <p>
                  {t("routerHas", { eth, dai, minEth, minDai, requiredEth })}{" "}
                  <a href="#withdraw" onClick={withdraw}>
                    <u>{t("withdrawEverything", { eth })}</u>
                  </a>
                  .
                </p>
              </div>
            </div>
          )
        ))}
      {key !== "noOp" && (
        <div className="d-flex w-100">
          <img src={clock} alt={t("clock")} className="mr-2" />
          <div
            dangerouslySetInnerHTML={{
              __html: t(key, { dai, eth, dest })
            }}
            style={key === "ethToDest" && { wordBreak: "break-all" }}
          />
        </div>
      )}
    </div>
  );
};

export default FundingStatus;
