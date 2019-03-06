import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Context, getState } from "store";
import WifiSettingsForm from "./WifiSettingsForm";
import { Alert, Card, CardBody, Form, Button, Progress } from "reactstrap";

const Wifi = () => {
  let [t] = useTranslation();
  let [submitting, setSubmitting] = useState(false);

  let {
    actions,
    state: { initializing, wifiError, loadingWifi, wifiSettings }
  } = useContext(Context);

  let [newSettings, setSettings] = useState(wifiSettings);

  useEffect(() => {
    actions.getWifiSettings();
  });

  if (!wifiSettings || !wifiSettings.length)
    if (loadingWifi && !wifiError)
      return initializing ? (
        <Progress animated color="info" value={100} />
      ) : null;
    else return <Alert color="info">{t("noWifi")}</Alert>;

  if (!newSettings) newSettings = wifiSettings;

  let submit = e => {
    setSubmitting(true);
    e.preventDefault();

    actions.startWaiting();

    let i = setInterval(async () => {
      actions.keepWaiting();
      if (getState().waiting <= 0) {
        clearInterval(i);
      }
    }, 1000);

    actions.saveWifiSettings(newSettings);
  };

  return (
    <Card>
      <CardBody>
        <Form onSubmit={submit}>
          {wifiSettings.map((_, i) => (
            <WifiSettingsForm
              key={i}
              index={i}
              submitting={submitting}
              wifiSettings={newSettings}
              setSettings={setSettings}
            />
          ))}

          <Button color="primary">{t("save")}</Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Wifi;
