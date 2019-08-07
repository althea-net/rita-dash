import React from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "store";

import Account from "../Frontpage/Account";
import DaoFee from "../AdvancedSettings/DaoFee";
import PriceForm from "./PriceForm";
import PrivateKeys from "./PrivateKeys";
import QualityForm from "./QualityForm";

import { Success } from "utils";

const Payments = () => {
  const [t] = useTranslation();
  const [{ withdrawalSuccess }] = useStore();

  return (
    <div>
      <h2 id="paymentsPage">{t("payments")}</h2>

      <Success message={withdrawalSuccess} />

      <Account />
      <QualityForm />
      <PriceForm />
      <DaoFee readonly={true} />
      <PrivateKeys />
    </div>
  );
};

export default Payments;
