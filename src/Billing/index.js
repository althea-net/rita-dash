import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Card, CardBody, Input, Table } from "reactstrap";
import Pagination from "./Pagination";
import { get } from "store";
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
  const [payments, setPayments] = useState([]);
  const { symbol } = useContext(AppContext);
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [period]);

  const limit = {
    Hourly: 24,
    Daily: 10,
    Weekly: 4,
    Monthly: 12
  }[period];

  let data = {};

  usage.map(b => {
    const date = new Date(b.index * msPerHr);
    let i;

    switch (period) {
      case "Hourly":
        i = b.index;
        break;
      case "Daily":
        i =
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          ).getTime() / msPerHr;
        break;
      case "Weekly":
        i =
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - date.getDay()
          ).getTime() / msPerHr;
        break;
      default:
      case "Monthly":
        i =
          new Date(date.getFullYear(), date.getMonth(), 1).getTime() / msPerHr;
        break;
    }

    if (!data[i]) data[i] = { up: 0, down: 0, cost: 0, service: 0 };

    data[i].up += b.up;
    data[i].down += b.down;
    data[i].cost += b.price * (b.up + b.down);
    let p = payments.find(p => p.index === b.index);
    if (p)
      data[i].service += p.payments
        .filter(p => p.to.meshIp === "::1")
        .reduce((a, b) => a + parseInt(b.amount), 0);

    return b;
  });

  useEffect(() => {
    (async () => {
      try {
        let usage = await get("/usage/client");
        if (!(usage instanceof Error)) setUsage(usage);
      } catch {}

      try {
        let payments = await get("/usage/payments");
        if (!(payments instanceof Error)) setPayments(payments);
      } catch {}
    })();
  }, []);

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
        return format(date, "MMM DD, YYYY");
      case "Hourly":
      default:
        date = new Date((parseInt(hour) + 1) * msPerHr);
        return format(date, "HH:SS");
    }
  };

  return (
    <div>
      <h1>{t("billing")}</h1>
      {!usage.length ? (
        <Alert color="info">{t("noUsage")}</Alert>
      ) : (
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
                  <th>{t("upload")}</th>
                  <th>{t("download")}</th>
                  <th>{t("bandwidthCost")}</th>
                  <th>{t("serviceCost")}</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(data)
                  .reverse()
                  .slice((page - 1) * limit, page * limit)
                  .map(d => (
                    <tr key={d}>
                      <td>
                        {start(d)} - {end(d)}
                      </td>
                      <td>
                        {BigNumber(data[d].up)
                          .div(bytesPerGb)
                          .toFixed(3)}
                        GB
                      </td>
                      <td>
                        {BigNumber(data[d].down)
                          .div(bytesPerGb)
                          .toFixed(3)}
                        GB
                      </td>
                      <td>
                        {toEth(data[d].cost, 6)} {symbol}
                      </td>
                      <td>
                        {toEth(data[d].service, 6)} {symbol}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>

            <Pagination
              usage={Object.keys(data)}
              limit={limit}
              page={page}
              setPage={setPage}
            />
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Billing;
