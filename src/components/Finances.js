import React from "react";
import { Card, CardBody, Button } from "reactstrap";
import updown from "../images/up_down.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default () => {
  return (
    <div style={{ marginBottom: 40 }}>
      <div className="w-100 d-flex justify-content-between">
        <h2>Finances</h2>
        <div style={{ color: "#3DADF5" }} className="my-auto">
          <span>Manage Payment Settings</span>
          <FontAwesomeIcon
            size="lg"
            icon="angle-right"
            style={{ marginLeft: 10 }}
          />
        </div>
      </div>
      <Card>
        <CardBody className="d-flex">
          <div
            className="pr-4 w-50 d-flex flex-column justify-content-between"
            style={{ borderRight: "1px solid #dadada" }}
          >
            <div className="d-flex justify-content-between">
              <h4>Account Balance</h4>
              <h4>0.452 ETH</h4>
            </div>
            <div>
              <Button
                style={{
                  background: "#3DADF5",
                  border: "none",
                  marginRight: 10,
                  width: 150
                }}
              >
                Top Up
              </Button>
              <Button
                style={{
                  background: "#3DADF5",
                  border: "none",
                  marginRight: 10,
                  width: 150
                }}
              >
                Withdraw
              </Button>
            </div>
          </div>
          <div className="pl-4 w-50 d-flex">
            <div className="pr-2">
              <img src={updown} alt="Upload/Download" />
            </div>
            <p>
              Based on your average usage of 8.4 GB per month, your balance will
              provide you with an estimated <strong>16 weeks</strong> of
              service.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
