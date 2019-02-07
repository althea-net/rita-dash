import React from "react";
import { Card, CardBody } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default () => {
  return (
    <div style={{ marginBottom: 40 }}>
      <div className="w-100 d-flex justify-content-between">
        <h2>Usage Metrics</h2>
        <div style={{ color: "#3DADF5" }} className="my-auto">
          <a href="#billing">
            Review Billing
            <FontAwesomeIcon
              size="lg"
              icon="angle-right"
              style={{ marginLeft: 10 }}
            />
          </a>
        </div>
      </div>

      <Card>
        <CardBody className="d-flex">
          <div
            className="pr-4 w-50 d-flex flex-column justify-content-between"
            style={{ borderRight: "1px solid #dadada" }}
          >
            <div className="d-flex flex-wrap justify-content-between">
              <h5 className="w-100" style={{ color: "gray" }}>
                Month to Date
              </h5>
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
          </div>
          <div className="pl-4 w-50 d-flex flex-wrap">
            <h5 className="w-100" style={{ color: "gray" }}>
              Last Month
            </h5>
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
        </CardBody>
      </Card>
    </div>
  );
};
