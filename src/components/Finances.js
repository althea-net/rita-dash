import React from "react";
import { Card, CardBody, Button } from "reactstrap";
import updown from "../images/up_down.png";

export default () => {
  return (
    <React.Fragment>
      <h2>Finances</h2>

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
              <Button color="primary" style={{ marginRight: 10, width: 150 }}>
                Top Up
              </Button>
              <Button color="primary" style={{ width: 150 }}>
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
    </React.Fragment>
  );
};
