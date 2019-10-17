import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Card,
  CardBody,
  Popover,
  PopoverHeader,
  PopoverBody,
  Progress,
  Table
} from "reactstrap";
import { get, useStore } from "store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useInterval from "hooks/useInterval";

const AbortController = window.AbortController;

const RelaySettings = () => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState();
  const [open, setOpen] = useState(false);
  const [{ neighbors }, dispatch] = useStore();
  const [initialized, setInitialized] = useState(false);

  const getNeighbors = useCallback(
    async signal => {
      if (!signal) {
        const controller = new AbortController();
        signal = controller.signal;
      }

      setLoading(true);
      try {
        let neighbors = await get("/neighbors", true, 10000, signal);
        if (neighbors instanceof Error) return;
        dispatch({ type: "neighbors", neighbors });
      } catch (e) {}
      setLoading(false);
      setInitialized(true);
    },
    [dispatch]
  );

  useInterval(getNeighbors, 10000);

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

  return (
    <Card className="mb-4">
      <CardBody>
        <h4>{t("neighbors")}</h4>
        {loading && !initialized ? (
          <Progress animated color="primary" value="100" />
        ) : !neighbors || !neighbors.length ? (
          <Alert color="info">{t("noNeighbors")}</Alert>
        ) : (
          <div className="table-responsive">
            <Popover
              boundariesElement="tooltip"
              placement="top"
              isOpen={open}
              target="tooltip"
              toggle={toggle}
              flip={false}
            >
              <PopoverHeader>{t("whatIsEnforcing")}</PopoverHeader>
              <PopoverBody>{t("enforcingIs")}</PopoverBody>
            </Popover>
            <Table className="table-striped">
              <thead>
                <tr>
                  <th style={{ whiteSpace: "nowrap" }}>{t("nickname")}</th>
                  <th style={{ whiteSpace: "nowrap" }}>
                    {t("connectionQuality")}
                  </th>
                  <th style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                    {t("enforcing")}{" "}
                    <FontAwesomeIcon
                      id="tooltip"
                      icon="question-circle"
                      className="mr-2"
                    />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {neighbors.map((n, i) => (
                  <tr key={i}>
                    <td style={{ verticalAlign: "middle" }}>{n.nickname}</td>
                    <td style={{ verticalAlign: "middle" }}>{n.routeMetric}</td>
                    <td style={{ verticalAlign: "middle" }}>
                      {n.debt &&
                      n.debt.paymentDetails.action === "SuspendTunnel"
                        ? t("yes")
                        : t("no")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default RelaySettings;
