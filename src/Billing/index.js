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
  const [client, setClient] = useState([]);
  const [relay, setRelay] = useState([]);
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

  let indices = client
    .map(h => h.index)
    .filter(x => relay.map(h => h.index).includes(x));

  indices.map(index => {
    const date = new Date(index * msPerHr);
    let i;

    switch (period) {
      case "Hourly":
        i = index;
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

    let p = payments.find(p => p.index === index);
    if (p)
      data[i].service += p.payments
        .filter(p => p.to.meshIp === "::1")
        .reduce((a, b) => a + parseInt(b.amount), 0);

    let c = client.find(c => c.index === index);

    data[i].up += c.up;
    data[i].down += c.down;
    data[i].cost += c.price * (c.up + c.down);

    return c;
  });

  useEffect(() => {
    (async () => {
      try {
        let client = await get("/usage/client");
        if (!(client instanceof Error)) setClient(client);
      } catch {}

      try {
        let relay = await get("/usage/relay");
        if (!(relay instanceof Error)) setRelay(relay);
      } catch {}

      try {
        let payments = await get("/client/payments");
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
      {!client.length ? (
        <Alert color="info">{t("noclient")}</Alert>
      ) : (
        <Card>
          <CardBody>
            <div className="d-flex flex-wrap">
              <h2>{t("history")}</h2>
              <div className="ml-auto d-flex mb-4">
                <div
                  style={{
                    whiteSpace: "nowrap",
                    fontSize: 16,
                    color: "#666"
                  }}
                  className="mt-2 mr-2 d-flex"
                >
                  <div className="my-auto mr-2">{t("displayPeriod")}</div>
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
            </div>
            <div className="table-responsive">
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
            </div>

            <Pagination
              data={Object.keys(data)}
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
