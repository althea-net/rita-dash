import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Input, Table } from "reactstrap";
import Pagination from "./Pagination";

export default (daoAddress, ipAddress) => {
  const [t] = useTranslation();

  return (
    <div>
      <h1>{t("billing")}</h1>
      <Card>
        <CardBody>
          <div className="d-flex">
            <h2>History</h2>
            <div className="ml-auto d-flex">
              <div
                style={{ whiteSpace: "nowrap", fontSize: 16, color: "#666" }}
                className="mt-2 mr-2"
              >
                Display Period
              </div>
              <Input type="select" style={{ color: "#666" }}>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </Input>
            </div>
          </div>
          <Table className="table-striped">
            <thead>
              <tr>
                <th>Period</th>
                <th>Usage</th>
                <th>Bandwidth Cost</th>
                <th>Service Cost</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Jan. 13, 2019 - Now</td>
                <td>8.4 GB</td>
                <td>0.334 ETH</td>
                <td>0.200 ETH</td>
                <td>0.534 ETH</td>
              </tr>
              <tr>
                <td>Jan. 13, 2019 - Now</td>
                <td>8.4 GB</td>
                <td>0.334 ETH</td>
                <td>0.200 ETH</td>
                <td>0.534 ETH</td>
              </tr>
              <tr>
                <td>Jan. 13, 2019 - Now</td>
                <td>8.4 GB</td>
                <td>0.334 ETH</td>
                <td>0.200 ETH</td>
                <td>0.534 ETH</td>
              </tr>
              <tr>
                <td>Jan. 13, 2019 - Now</td>
                <td>8.4 GB</td>
                <td>0.334 ETH</td>
                <td>0.200 ETH</td>
                <td>0.534 ETH</td>
              </tr>
              <tr>
                <td>Jan. 13, 2019 - Now</td>
                <td>8.4 GB</td>
                <td>0.334 ETH</td>
                <td>0.200 ETH</td>
                <td>0.534 ETH</td>
              </tr>
              <tr>
                <td>Jan. 13, 2019 - Now</td>
                <td>8.4 GB</td>
                <td>0.334 ETH</td>
                <td>0.200 ETH</td>
                <td>0.534 ETH</td>
              </tr>
              <tr>
                <td>Jan. 13, 2019 - Now</td>
                <td>8.4 GB</td>
                <td>0.334 ETH</td>
                <td>0.200 ETH</td>
                <td>0.534 ETH</td>
              </tr>
              <tr>
                <td>Jan. 13, 2019 - Now</td>
                <td>8.4 GB</td>
                <td>0.334 ETH</td>
                <td>0.200 ETH</td>
                <td>0.534 ETH</td>
              </tr>
              <tr>
                <td>Jan. 13, 2019 - Now</td>
                <td>8.4 GB</td>
                <td>0.334 ETH</td>
                <td>0.200 ETH</td>
                <td>0.534 ETH</td>
              </tr>
            </tbody>
          </Table>

          <p>
            Service costs are withdrawn monthly. In this weekly view, the
            prorated amount is displayed.
          </p>

          <Pagination />
        </CardBody>
      </Card>
    </div>
  );
};
