import React from "react";
import { Card, CardBody } from "reactstrap";
import bigGreenCheck from "../images/big_green_check.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default () => {
  return (
    <div style={{ marginBottom: 50 }}>
      <div className="w-100 d-flex justify-content-between">
        <h2>Network Connection</h2>
        <div style={{ color: "#3DADF5" }} className="my-auto">
          <a href="#network-settings">
            Manage Network Connection
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
          </div>
          <div className="pl-4 w-50 d-flex flex-wrap">
            <div className="d-flex w-100 justify-content-around">
              <img src={bigGreenCheck} alt="Big Green Checkmark" />
              <div className="my-auto" style={{ color: "gray" }}>
                Your connection is looking great!
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
