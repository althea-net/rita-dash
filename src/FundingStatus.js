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
  const [waitingForEth, setWaitingForEth] = useState(false);
  const [{ symbol, status }] = useStore();

  let key, reserve, minEth, minDai, requiredEth, dai, eth, dest;

  if (status)
    ({ key, reserve, minEth, minDai, requiredEth, dai, eth, dest } = status);

  useEffect(
    () => {
      let timer;

      if (key === "daiToXdai") {
        setWaitingForXdai(true);
        timer = setTimeout(() => setWaitingForXdai(false), 120000);
      }

      if (key === "ethToDest") {
        setWaitingForEth(t(key, { dai, eth, dest }));
        timer = setTimeout(() => setWaitingForEth(false), 120000);
      }

      return () => {
        if (key === "noOp") clearTimeout(timer);
      };
    },
    [dai, eth, dest, t, key, status]
  );

  const withdraw = (e) => {
    e.preventDefault();
    setWithdrawing(true);
  };

  if (!(status && key) || symbol !== "Dai") return null;

  return (
    <div className="mt-2">
      <WithdrawAll open={withdrawing} setOpen={setWithdrawing} />
      {key === "noOp" &&
        !waitingForEth &&
        (waitingForXdai ? (
          <div className="d-flex w-100">
            <img src={clock} alt={t("clock")} className="mr-2" />
            {
              <div
                dangerouslySetInnerHTML={{
                  __html: t("fundsAdded"),
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
                  {t("routerHas", { minDai })}{" "}
                  <a href="#withdraw" onClick={withdraw}>
                    <u>{t("withdrawEverything", { eth })}</u>
                  </a>
                  .
                </p>
              </div>
            </div>
          )
        ))}
      {(key !== "noOp" || waitingForEth) && (
        <div className="d-flex w-100">
          <img src={clock} alt={t("clock")} className="mr-2" />
          <div
            dangerouslySetInnerHTML={{
              __html: waitingForEth || t(key, { dai, eth, dest }),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FundingStatus;
