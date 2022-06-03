import React from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "store";
import { BigNumber } from "bignumber.js";

const SystemWarning = () => {
  const [t] = useTranslation();
  const [{ balance, closeThreshold, debt, lowBalance, selectedExit }] =
    useStore();
  if (!(lowBalance && debt)) return null;

  return (
    <div className="system-warning">
      {selectedExit
        ? debt.negated().isLessThan(BigNumber(closeThreshold)) ||
          parseInt(balance) === 0
          ? t("accountThrottled")
          : t("accountWarning")
        : t("noConnectionDetected") +
          ". " +
          t("youNeedTo") +
          t("setupYourExit")}
    </div>
  );
};

export default SystemWarning;
