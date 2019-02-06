import React from "react";
import { Card, CardBody, Button } from "reactstrap";
import updown from "../images/up_down.png";

export default () => {
  return (
    <React.Fragment>
      <h2>Usage Metrics</h2>

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
                  <div>Usage</div>
                </div>
                <div>
                  <div>
                    <h4>0.24 ETH</h4>
                  </div>
                  <div>Cost</div>
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
                <div>Usage</div>
              </div>
              <div>
                <div>
                  <h4>0.45 ETH</h4>
                </div>
                <div>Cost</div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};
