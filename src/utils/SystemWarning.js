import React from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "store";
import { BigNumber } from "bignumber.js";

const SystemWarning = () => {
  const [t] = useTranslation();
  const [{ balance, closeThreshold, debt, exits, lowBalance }] = useStore();

  let selected = null;
  if (exits && exits.length) {
    selected = exits.find(exit => {
      let { state } = exit.exitSettings;
      return exit.isSelected && state === "Registered";
    });
  }

  if (selected && !(lowBalance && debt)) return null;

  return (
    <div className="system-warning">
      {selected
        ? debt.negated().isLessThan(BigNumber(closeThreshold)) ||
          parseInt(balance) === 0
          ? t("accountThrottled")
          : t("accountWarning")
        : t("exitWarning")}
    </div>
  );
};

export default SystemWarning;
