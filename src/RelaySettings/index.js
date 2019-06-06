import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Badge, Button, Progress, Table } from "reactstrap";
import { get, post, useStore } from "store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EnforcementModal from "./EnforcementModal";

const AbortController = window.AbortController;

const RelaySettings = () => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState();
  const [open, setOpen] = useState(false);
  const [{ neighbors }, dispatch] = useStore();

  const getNeighbors = useCallback(
    async signal => {
      setLoading(true);
      try {
        let debts = await get("/debts", true, 10000, signal);
        let neighbors = await get("/neighbors", true, 10000, signal);
        if (debts instanceof Error || neighbors instanceof Error) return;
        dispatch({ type: "debts", debts });
        dispatch({ type: "neighbors", neighbors });
      } catch (e) {}
      setLoading(false);
    },
    [dispatch]
  );

  useEffect(
    () => {
      const controller = new AbortController();
      const signal = controller.signal;

      getNeighbors(signal);

      return () => controller.abort();
    },
    [getNeighbors]
  );

  const toggle = () => setOpen(!open);

  const resetDebts = async n => {
    await post("/debts/reset", {
      mesh_ip: n.debt.identity.meshIp,
      eth_address: n.debt.identity.ethAddress,
      wg_public_key: n.debt.identity.wgPublicKey
    });

    setInterval(getNeighbors, 5000);
  };

  return (
    <>
      <h1 id="frontPage">{t("neighbors")}</h1>
      {loading ? (
        <Progress animated color="info" value="100" />
      ) : !neighbors || !neighbors.length ? (
        <Alert color="info">{t("noNeighbors")}</Alert>
      ) : (
        <div className="table-responsive">
          <Table className="table-striped">
            <thead>
              <tr>
                <th style={{ whiteSpace: "nowrap" }}>{t("nickname")}</th>
                <th style={{ whiteSpace: "nowrap" }}>
                  {t("connectionQuality")}
                </th>
                <th
                  style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  onClick={toggle}
                >
                  {t("enforcing")}{" "}
                  <FontAwesomeIcon
                    id="tooltip"
                    icon="question-circle"
                    className="mr-2"
                  />
                  <EnforcementModal open={open} toggle={toggle} />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {neighbors.map((n, i) => (
                <tr key={i}>
                  <td style={{ verticalAlign: "middle" }}>{n.nickname}</td>
                  <td style={{ verticalAlign: "middle" }}>
                    {n.routeMetricToExit}
                  </td>
                  {n.debt.paymentDetails.action === "SuspendTunnel" ? (
                    <>
                      <td style={{ verticalAlign: "middle" }}>
                        <Badge color="danger" className="mb-1">
                          {t("yes")}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          outline
                          style={{ whiteSpace: "nowrap" }}
                          onClick={() => resetDebts(n)}
                        >
                          {t("stopEnforcing")}
                        </Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <Badge color="success">{t("no")}</Badge>
                      </td>
                      <td />
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default RelaySettings;
