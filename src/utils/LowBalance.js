import React from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "store";
import { BigNumber } from "bignumber.js";

const LowBalance = () => {
  const [t] = useTranslation();
  const [{ balance, debt, closeThreshold, lowBalance }] = useStore();

  if (!lowBalance || !debt) return null;

  if (
    debt.negated().isLessThan(BigNumber(closeThreshold)) ||
    parseInt(balance) === 0
  )
    return <div className="low-balance">{t("accountThrottled")}</div>;
  else return <div className="low-balance">{t("accountWarning")}</div>;
};

export default LowBalance;
