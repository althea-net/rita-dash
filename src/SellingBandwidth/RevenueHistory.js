import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, Card, CardBody, Input, Table } from "reactstrap";
import Pagination from "../Pagination";
import { get, useStore } from "store";
import { groupRelayUsageData } from "utils";
import ExportCSV from "../Finances/ExportCSV";

import { enUS as en, es, fr } from "date-fns/locale";

const RevenueHistory = () => {
  const [t, i18n] = useTranslation();
  const locale = { en, es, fr }[i18n.language];

  const [period, setPeriod] = useState("w");
  const [clientUsage, setClientUsage] = useState([]);
  const [relayUsage, setRelayUsage] = useState([]);
  const [{ symbol }] = useStore();
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [localization, setLocalization] = useState([]);
  const [info, setInfo] = useState([]);
  const [payments, setPayments] = useState([]);

  const periods = {
    d: t("daily"),
    w: t("weekly"),
    m: t("monthly"),
  };

  const limit = {
    h: 24,
    d: 10,
    w: 4,
    m: 12,
  }[period];

  useEffect(() => setPage(1), [period]);

  useEffect(() => {
    (async () => {
      try {
        let payments = await get("/usage/payments");
        let clientUsage = await get("/usage/client");
        let relayUsage = await get("/usage/relay");
        let info = await get("/info");
        let localization = await get("/localization");
        if (!(clientUsage instanceof Error)) setClientUsage(clientUsage);
        if (!(relayUsage instanceof Error)) setRelayUsage(relayUsage);
        if (!(localization instanceof Error)) setLocalization(localization);
        if (!(info instanceof Error)) setInfo(info);
        if (!(payments instanceof Error)) setPayments(payments);
      } catch {}
    })();
  }, []);

  let symbol_or_star =
    symbol === "Dai" && localization.displayCurrencySymbol ? symbol : "◈";

  const [rows, data] = useMemo(
    () =>
      groupRelayUsageData(
        info,
        clientUsage,
        relayUsage,
        period,
        symbol_or_star,
        locale,
        page,
        limit,
        payments
      ),
    [
      info,
      relayUsage,
      period,
      symbol_or_star,
      locale,
      page,
      limit,
      payments,
      clientUsage,
    ]
  );

  return (
    <Card className="mb-2">
      <CardBody>
        <ExportCSV open={exporting} setOpen={setExporting} rows={rows} />

        <div>
          {!rows.length ? (
            <>
              <h4>{t("revenueHistory")}</h4>
              <Alert color="info">{t("noUsage")}</Alert>
            </>
          ) : (
            <>
              <div className="d-flex mb-2 flex-wrap">
                <h4>{t("revenueHistory")}</h4>
                <div className="ml-auto d-flex">
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: 16,
                      color: "#666",
                    }}
                    className="mr-2 d-flex"
                  >
                    <div className="my-auto mr-2">{t("displayPeriod")}</div>
                    <Input
                      type="select"
                      style={{ color: "#666" }}
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    >
                      {Object.keys(periods).map((p) => (
                        <option key={p} value={p}>
                          {periods[p]}
                        </option>
                      ))}
                    </Input>
                  </div>
                </div>
              </div>
              <p>{t("revenueDescription")}</p>
              <div className="table-responsive">
                <Table className="table-striped">
                  <thead>
                    <tr>
                      <th>{t("period")}</th>
                      <th className="text-right">{t("relayUsage")}</th>
                      <th className="text-right">{t("totalRevenue")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.period}>
                        <td>{r.period}</td>
                        <td className="text-right">{r.usage}</td>
                        <td className="text-right">{r.totalCost}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="d-flex flex-wrap w-100 justify-content-between">
                <div className="d-none d-sm-block" />
                <Pagination
                  data={Object.keys(data)}
                  limit={limit}
                  page={page}
                  setPage={setPage}
                  className="mb-2 mx-auto"
                />

                <div className="text-right mx-auto mx-sm-0">
                  <Button onClick={() => setExporting(true)}>
                    {t("exportToCsv")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default RevenueHistory;
