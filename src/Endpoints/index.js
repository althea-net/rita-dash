import React, { useCallback, useEffect, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Progress } from "reactstrap";
import { get } from "store";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useStore } from "store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const endpoints = [
  "/info",
  "/exits",
  "/settings",
  "/debts",
  "/neighbors",
  "/wifi_settings",
  "/dao_list",
  "/interfaces",
  "/mesh_ip",
  "/local_fee",
  "/metric_factor",
  "/auto_price/enabled",
  "/blockchain/get/",
  "/usage/client",
  "/usage/relay",
  "/usage/payments"
];

const Endpoint = memo(({ collapsed, path }) => {
  const [result, setResult] = useState();
  const [loading, setLoading] = useState();
  const [, dispatch] = useStore();

  const fetch = useCallback(
    async () => {
      setLoading(true);
      try {
        let res = await get(path);
        if (!(res instanceof Error)) {
          if (res.network) res.network.wgPrivateKey = "<redacted>";
          if (res.payment) res.payment.ethPrivateKey = "<redacted>";
          dispatch({ type: "api", path, res });
          setResult(res);
        }
      } catch {}
      setLoading(false);
    },
    [dispatch, path]
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
        collapsed || <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
});

const APIDump = () => {
  const [t] = useTranslation();
  const [collapsed, setCollapsed] = useState();
  const [{ results }] = useStore();
  const [copied, setCopied] = useState(false);

  const toggleCollapse = e => {
    e.preventDefault();
    setCollapsed(!collapsed);
  };

  const data = JSON.stringify(results, null, 2);

  return (
    <div>
      <h1>{t("debuggingData")}</h1>
      <Card className="my-4">
        <CardBody>
          <div className="float-right">
            <CopyToClipboard text={data} onCopy={() => setCopied(true)}>
              <a href="#endpoints" onClick={e => e.preventDefault()}>
                <span>
                  <FontAwesomeIcon icon="copy" className="mr-2" />
                  {copied ? t("copied") : t("copyToClipboard")}
                </span>
              </a>
            </CopyToClipboard>
            <span> | </span>
            <a href="#endpoints" onClick={toggleCollapse}>
              {collapsed ? t("expandAll") : t("collapseAll")}
            </a>
          </div>
          {endpoints.map(path => (
            <Endpoint {...{ collapsed, key: path, path }} />
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default APIDump;
