import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, Card, CardBody, Input, Table } from "reactstrap";
import Pagination from "../Pagination";
import { get, useStore } from "store";
import { BigNumber } from "bignumber.js";
import { toEth } from "utils";
import { format } from "date-fns";
import ExportCSV from "./ExportCSV";

import { enUS as en, es, fr } from "date-fns/locale";

const bytesPerGb = BigNumber("1000000000");
const msPerHr = 3600000;

const Billing = (daoAddress, ipAddress) => {
  const [t, i18n] = useTranslation();
  const locale = { en, es, fr }[i18n.language];

  const [period, setPeriod] = useState("w");
  const [usage, setUsage] = useState([]);
  const [exporting, setExporting] = useState(true);
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(1);

  const [{ symbol }] = useStore();

  const periods = {
    h: t("hourly"),
    d: t("daily"),
    w: t("weekly"),
    m: t("monthly")
  };

  useEffect(() => setPage(1), [period]);

  const limit = {
    h: 24,
    d: 10,
    w: 4,
    m: 12
  }[period];

  let data = {};

  let indices = usage.map(h => h.index);

  indices.map(index => {
    const date = new Date(index * msPerHr);
    let i;

    switch (period) {
      case "h":
        i = index;
        break;
      case "d":
        i =
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          ).getTime() / msPerHr;
        break;
      case "w":
        i =
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - date.getDay()
          ).getTime() / msPerHr;
        break;
      default:
      case "m":
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

    let c = usage.find(c => c.index === index);

    data[i].up += c.up;
    data[i].down += c.down;
    data[i].cost += c.price * (c.up + c.down);

    return c;
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
      case "m":
        return format(date, "MMM", { locale });
      case "d":
        return format(date, "MMM dd", { locale });
      case "w":
        return format(date, "MMM dd", { locale });
      case "h":
      default:
        return format(date, "MMM dd, HH:SS", { locale });
    }
  };

  const end = hour => {
    let date = new Date(hour * msPerHr);

    switch (period) {
      case "m":
        date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        return format(date, "MMM yyyy", { locale });
      case "d":
        date = new Date((parseInt(hour) + 24) * msPerHr);
        return format(date, "dd, yyyy", { locale });
      case "w":
        date = new Date((parseInt(hour) + 7 * 24) * msPerHr);
        return format(date, "MMM dd, yyyy", { locale });
      case "h":
      default:
        date = new Date((parseInt(hour) + 1) * msPerHr);
        return format(date, "HH:SS", { locale });
    }
  };

  const rows = Object.keys(data)
    .reverse()
    .slice((page - 1) * limit, page * limit)
    .map(d => ({
      index: d.index,
      period: `${start(d)} - ${end(d)}`,
      usage:
        BigNumber(data[d].up + data[d].down)
          .div(bytesPerGb)
          .toFixed(3) + "GB",
      bandwidthCost: `${toEth(data[d].cost, 3)} ${symbol}`,
      serviceCost: `${toEth(data[d].service, 3)} ${symbol}`,
      totalCost: `${toEth(data[d].service + data[d].cost, 3)} ${symbol}`
    }));

  return (
    <div>
      <ExportCSV open={exporting} setOpen={setExporting} rows={rows} />

      {!usage.length ? (
        <Alert color="info">{t("noUsage")}</Alert>
      ) : (
        <Card>
          <CardBody>
            <div className="d-flex flex-wrap">
              <h3>{t("billingHistory")}</h3>
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
                    {Object.keys(periods).map(p => (
                      <option key={p} value={p}>
                        {periods[p]}
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
                    <th>{t("usage")}</th>
                    <th>{t("bandwidthCost")}</th>
                    <th>{t("serviceCost")}</th>
                    <th>{t("totalCost")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.period}>
                      <td>{r.period}</td>
                      <td>{r.usage}</td>
                      <td>{r.bandwidthCost}</td>
                      <td>{r.serviceCost}</td>
                      <td>{r.totalCost}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div className="d-flex w-100 justify-content-between">
              <div />
              <Pagination
                data={Object.keys(data)}
                limit={limit}
                page={page}
                setPage={setPage}
              />

              <div className="text-right">
                <Button onClick={() => setExporting(true)}>
                  {t("exportToCsv")}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Billing;
