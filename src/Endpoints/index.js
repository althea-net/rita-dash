import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Progress } from "reactstrap";
import { get } from "store";
import ReactJson from "react-json-view";

const endpoints = [
  "/info",
  "/exits",
  "/settings",
  "/debts",
  "/neighbors",
  "/wifi_settings",
  "/dao_list",
  "/interfaces",
  "/eth_private_key",
  "/mesh_ip",
  "/local_fee",
  "/metric_factor",
  "/auto_price/enabled",
  "/blockchain/get",
  "/nickname/get",
  "/usage/client",
  "/usage/relay",
  "/usage/payments"
];

const Endpoint = ({ collapsed, path }) => {
  const [result, setResult] = useState();
  const [loading, setLoading] = useState();

  const fetch = useCallback(
    async () => {
      setLoading(true);
      try {
        const res = await get(path);
        if (!(res instanceof Error)) setResult(res);
      } catch {}
      setLoading(false);
    },
    [path]
  );

  useEffect(
    () => {
      fetch();
    },
    [fetch]
  );

  return (
    <div className="mb-2">
      <b>{path}:</b>
      {loading ? (
        <Progress animated color="info" value="100" />
      ) : (
        <ReactJson src={result} collapsed={collapsed} name={null} />
      )}
    </div>
  );
};

const APIDump = () => {
  const [t] = useTranslation();
  const [collapsed, setCollapsed] = useState();

  const toggleCollapse = e => {
    e.preventDefault();
    setCollapsed(!collapsed);
  };

  return (
    <div>
      <h1>{t("debuggingData")}</h1>
      <Card className="my-4">
        <CardBody>
          <div className="float-right">
            <a href="#endpoints" onClick={toggleCollapse}>
              {collapsed ? t("expandAll") : t("collapseAll")}
            </a>
          </div>
          {endpoints.map(path => (
            <Endpoint collapsed={collapsed} path={path} />
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default APIDump;
