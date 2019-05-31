import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  Popover,
  PopoverBody,
  PopoverHeader,
  Progress,
  Table
} from "reactstrap";
import { get } from "store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AbortController = window.AbortController;

const RelaySettings = () => {
  const [t] = useTranslation();
  const [neighbors, setNeighbors] = useState();
  const [loading, setLoading] = useState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      setLoading(true);
      try {
        const res = await get("/neighbors", true, 10000, signal);
        if (res instanceof Error) return;
        setNeighbors(res);
      } catch (e) {}
      setLoading(false);
    })();

    return () => controller.abort();
  }, []);

  if (!neighbors) return <Alert color="info">No neighbors were found</Alert>;
  if (loading) return <Progress animated color="info" value="100" />;

  const toggle = () => setOpen(!open);

  return (
    <>
      <h1 id="frontPage">{t("neighbors")}</h1>
      <div className="table-responsive">
        <Table className="table-striped">
          <thead>
            <tr>
              <th>{t("nickname")}</th>
              <th>{t("connectionQuality")}</th>
              <th>
                {t("enforcing")}{" "}
                <FontAwesomeIcon
                  id="tooltip"
                  icon="question-circle"
                  className="mr-2"
                />
                <Popover isOpen={open} target="tooltip" toggle={toggle}>
                  <PopoverHeader>{t("whatIsEnforcing")}</PopoverHeader>
                  <PopoverBody>{t("enforcingIs")}</PopoverBody>
                </Popover>
              </th>
            </tr>
          </thead>
          <tbody>
            {neighbors.map((n, i) => (
              <tr key={i}>
                <td>{n.nickname}</td>
                <td>{n.routeMetricToExit}</td>
                {i === 3 ? (
                  <td>
                    {t("yes")} <Button size="sm">{t("stopEnforcing")}</Button>
                  </td>
                ) : (
                  <td>{t("no")}</td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default RelaySettings;
