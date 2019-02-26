import React from "react";
import { useTranslation } from "react-i18next";
import bigGreenCheck from "images/big_green_check.png";
import { Card, Heading, Left, Right } from "./ui";

export default () => {
  let [t] = useTranslation();

  return (
    <div style={{ marginBottom: 20 }}>
      <Heading
        title={t("networkConnection")}
        link="#network-settings"
        linkText={t("manageNetworkConnection")}
      />

      <Card>
        <Left>
          <div className="d-flex flex-wrap justify-content-between">
            <div className="d-flex w-100 justify-content-around">
              <div>
                <div>
                  <h4>130.2 MBps</h4>
                </div>
                <div style={{ color: "gray" }}>Avg. Download</div>
              </div>
              <div>
                <div>
                  <h4>20.3 MBps</h4>
                </div>
                <div style={{ color: "gray" }}>Avg. Upload</div>
              </div>
            </div>
          </div>
        </Left>
        <Right>
          <div className="d-flex w-100 justify-content-around">
            <img
              src={bigGreenCheck}
              alt="Big Green Checkmark"
              style={{ marginRight: 10 }}
            />
            <div className="my-auto" style={{ color: "gray" }}>
              {t("yourConnection")}
            </div>
          </div>
        </Right>
      </Card>
    </div>
  );
};
