import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import AppContext from "store/App";

const LowBalance = () => {
  const [t] = useTranslation();
  const {
    debt,
    info: { closeThreshold, lowBalance }
  } = useContext(AppContext);

  if (!lowBalance) return null;

  if (-debt < closeThreshold)
    return <div className="low-balance">{t("accountThrottled")}</div>;
  else return <div className="low-balance">{t("accountWarning")}</div>;
};

export default LowBalance;
