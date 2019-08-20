import React from "react";
import { useTranslation } from "react-i18next";
import Price from "./Price";
import RelaySettings from "./RelaySettings";
import RevenueHistory from "./RevenueHistory";

const SellingBandwidth = () => {
  const [t] = useTranslation();
  return (
    <>
      <h2>{t("sellingBandwidth")}</h2>
      <Price />
      <RelaySettings />
      <RevenueHistory />
    </>
  );
};

export default SellingBandwidth;
