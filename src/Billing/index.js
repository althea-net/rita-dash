import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Input, Table } from "reactstrap";
import Pagination from "./Pagination";
import { get, init } from "store";
import AppContext from "store/App";
import { BigNumber } from "bignumber.js";
import { toEth } from "utils";
import { format } from "date-fns";

const periods = ["Hourly", "Daily", "Weekly", "Monthly"];
const bytesPerGb = BigNumber("1000000000");
const msPerHr = 3600000;

const Billing = (daoAddress, ipAddress) => {
  const [t] = useTranslation();
  const [period, setPeriod] = useState("Weekly");
  const [usage, setUsage] = useState([]);
  const { symbol } = useContext(AppContext);

  let data = {};

  usage.map(b => {
    let date = new Date(b.index * msPerHr);
    let start;

    switch (period) {
      case "Hourly":
        start = b.index;
        break;
      case "Daily":
        start =
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          ).getTime() / msPerHr;
        break;
      case "Weekly":
        start =
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - date.getDay()
          ).getTime() / msPerHr;
        break;
      default:
      case "Monthly":
        start =
          new Date(date.getFullYear(), date.getMonth(), 1).getTime() / msPerHr;
        break;
    }

    console.log(start);
    if (!data[start]) data[start] = { usage: 0, cost: 0 };

    data[start].usage += b.up + b.down;
    data[start].cost += b.price * (b.up + b.down);

    return b;
  });

  init(async () => {
    setUsage(await get("/usage/client"));
  });

  const start = hour => {
    let date = new Date(hour * msPerHr);

    switch (period) {
      case "Monthly":
        return format(date, "MMM");
      case "Daily":
        return format(date, "MMM DD");
      case "Weekly":
        return format(date, "MMM DD");
      case "Hourly":
      default:
        return format(date, "MMM DD, HH:SS");
    }
  };

  const end = hour => {
    let date = new Date(hour * msPerHr);

    switch (period) {
      case "Monthly":
        date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        return format(date, "MMM YYYY");
      case "Daily":
        date = new Date((parseInt(hour) + 24) * msPerHr);
        return format(date, "DD, YYYY");
      case "Weekly":
        date = new Date((parseInt(hour) + 7 * 24) * msPerHr);
        return format(date, "DD, YYYY");
      case "Hourly":
      default:
        date = new Date((parseInt(hour) + 1) * msPerHr);
        return format(date, "HH:SS");
    }
  };

  return (
    <div>
      <h1>{t("billing")}</h1>
      <Card>
        <CardBody>
          <div className="d-flex">
            <h2>{t("history")}</h2>
            <div className="ml-auto d-flex">
              <div
                style={{ whiteSpace: "nowrap", fontSize: 16, color: "#666" }}
                className="mt-2 mr-2"
              >
                {t("displayPeriod")}
              </div>
              <Input
                type="select"
                style={{ color: "#666" }}
                value={period}
                onChange={e => setPeriod(e.target.value)}
              >
                {periods.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Input>
            </div>
          </div>
          <Table className="table-striped">
            <thead>
              <tr>
                <th>{t("period")}</th>
                <th>{t("usage")}</th>
                <th>{t("bandwidthUsage")}</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(data)
                .reverse()
                .map(d => (
                  <tr key={d}>
                    <td>
                      {start(d)} - {end(d)}
                    </td>
                    <td>
                      {BigNumber(data[d].usage)
                        .div(bytesPerGb)
                        .toFixed(1)}{" "}
                      GB
                    </td>
                    <td>
                      {toEth(data[d].cost, 6)} {symbol}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>

          <Pagination />
        </CardBody>
      </Card>
    </div>
  );
};

export default Billing;
