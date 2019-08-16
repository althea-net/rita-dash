import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStore } from "store";
import { toEth } from "utils";
import WithdrawEth from "./WithdrawEth";
import clock from "./images/clock.svg";

const FundingStatus = () => {
  const [t] = useTranslation();
  const [withdrawing, setWithdrawing] = useState(false);
  const [waitingForXdai, setWaitingForXdai] = useState(false);
  const [{ status }] = useStore();

  let reserve, key, eth, dai, minEth, minDai, requiredEth, dest;

  if (status) {
    key = Object.keys(status.state)[0];
    let state = status.state[key];
    let rate = toEth(state.weiPerDollar, 8);

    switch (key) {
      case "ethToDai":
        eth = toEth(state.amountOfEth);
        dai = eth / rate;
        break;
      case "daiToXdai":
      case "xdaiToDai":
        dai = parseFloat(toEth(state.amount));
        break;
      case "daiToEth":
        dai = state.amountOfDai;
        eth = (state.amountOfDai * rate).toFixed(4).toString();
        break;
      case "ethToDest":
        eth = toEth(state.amountOfEth);
        dai = eth / rate;
        dest = state.destAddress;
        break;
      default:
      case "noOp":
        eth = toEth(state.ethBalance);
        dai = eth / rate;
        break;
    }

    reserve = parseFloat(status.reserveAmount) * rate;
    minDai = parseFloat(status.minimumDeposit);
    minEth = minDai * rate;
    requiredEth = minEth - eth + 0.0001;

    dai = dai.toFixed(2).toString();
    minDai = minDai.toFixed(2).toString();
    minEth = minEth.toFixed(4).toString();
    requiredEth = requiredEth.toFixed(4).toString();
  }

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

  /*
  const withdraw = e => {
    e.preventDefault();
    setWithdrawing(true);
    };
  */

  return (
    <div className="mt-2">
      <WithdrawEth open={withdrawing} setOpen={setWithdrawing} eth={eth} />
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
                  {/*
                <a href="#withdraw" onClick={withdraw}>
                  <u>{t("withdrawEth", { eth })}</u>
                </a>
                */}
                </p>
              </div>
            </div>
          )
        ))}
      {key !== "noOp" && (
        <div className="d-flex w-100">
          <img src={clock} alt={t("clock")} className="mr-2" />
          {
            <div
              dangerouslySetInnerHTML={{
                __html: t(key, { dai, eth, dest })
              }}
            />
          }
        </div>
      )}
    </div>
  );
};

export default FundingStatus;
