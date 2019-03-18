import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { get, actions, getState } from "store";
import WifiSettingsForm from "./WifiSettingsForm";
import { Alert, Card, CardBody, Form, Button, Progress } from "reactstrap";
import { Error } from "utils";

const Wifi = () => {
  let [t] = useTranslation();
  let [submitting, setSubmitting] = useState(false);
  let [wifiError, setWifiError] = useState(null);
  let [wifiSettings, setWifiSettings] = useState(null);
  let [loading, setLoading] = useState(false);
  let [channels, setChannels] = useState({});

  let getWifiSettings = async () => {
    let settings = await get("/wifi_settings");
    if (settings instanceof Error) {
      setWifiError(t("wifiError"));
      setLoading(false);
    }

    await Promise.all(
      settings.map(async setting => {
        let radio = setting.device.sectionName;
        channels[radio] = [];
        try {
          channels[radio] = await get(`/wifi_settings/get_channels/${radio}`);
        } catch (e) {}
        return channels[radio];
      })
    );

    setChannels(channels);
    setWifiSettings(settings);
  };

  useEffect(() => {
    getWifiSettings();
    return;
  }, []);

  if (!wifiSettings || !wifiSettings.length)
    if (loading && !wifiError)
      return <Progress animated color="info" value={100} />;
    else return <Alert color="info">{t("noWifi")}</Alert>;

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

    actions.saveWifiSettings(wifiSettings);
  };

  let valid = wifiSettings.reduce(
    (a, b) => a && (b.ssid.length >= 8 && b.key.length >= 8),
    true
  );

  return (
    <Card>
      <CardBody>
        <Error error={wifiError} />
        <Form onSubmit={submit}>
          {wifiSettings.map((_, i) => (
            <WifiSettingsForm
              channels={channels}
              key={i}
              index={i}
              submitting={submitting}
              wifiSettings={wifiSettings}
              setWifiSettings={setWifiSettings}
            />
          ))}

          <Button color="primary" disabled={!valid}>
            {t("save")}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Wifi;
