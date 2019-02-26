import React from "react";
import { Card, Heading, Left, Right } from "./ui";
import { useTranslation } from "react-i18next";

export default () => {
  let [t] = useTranslation();

  return (
    <div style={{ marginBottom: 40 }}>
      <Heading
        title={t("usageMetrics")}
        link="#billing"
        linkText={t("reviewBilling")}
      />
      <Card>
        <Left>
          <div className="d-flex flex-wrap justify-content-between w-100">
            <h5 style={{ color: "gray" }}>Month to Date</h5>
            <div className="d-flex w-100 justify-content-around">
              <div>
                <div>
                  <h4>4.8 GB</h4>
                </div>
                <div style={{ color: "gray" }}>Usage</div>
              </div>
              <div>
                <div>
                  <h4>0.24 ETH</h4>
                </div>
                <div style={{ color: "gray" }}>Cost</div>
              </div>
            </div>
          </div>
        </Left>
        <Right>
          <div className="d-flex flex-wrap justify-content-between w-100">
            <h5 style={{ color: "gray" }}>Last Month</h5>
            <div className="d-flex w-100 justify-content-around">
              <div>
                <div>
                  <h4>10.2 GB</h4>
                </div>
                <div style={{ color: "gray" }}>Usage</div>
              </div>
              <div>
                <div>
                  <h4>0.45 ETH</h4>
                </div>
                <div style={{ color: "gray" }}>Cost</div>
              </div>
            </div>
          </div>
        </Right>
      </Card>
    </div>
  );
};
