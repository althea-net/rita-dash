import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { get, actions, getState } from "store";
import WifiSettingsForm from "./WifiSettingsForm";
import { Alert, Card, CardBody, Form, Button, Progress } from "reactstrap";
import { Error } from "utils";

const Wifi = () => {
  const [t] = useTranslation();
  const [wifiError, setWifiError] = useState(null);
  const [wifiSettings, setWifiSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState({});

  useEffect(
    () => {
      const init = async () => {
        try {
          let settings = await get("/wifi_settings");

          await Promise.all(
            settings.map(async setting => {
              let radio = setting.device.sectionName;
              channels[radio] = [];
              try {
                channels[radio] = await get(
                  `/wifi_settings/get_channels/${radio}`
                );
              } catch (e) {}
              return channels[radio];
            })
          );

          setChannels(channels);
          setWifiSettings(settings);
        } catch (e) {
          setWifiError(t("wifiError"));
          setLoading(false);
          return;
        }
      };

      init();
      return;
    },
    [channels, t]
  );

  if (!wifiSettings || !wifiSettings.length)
    if (loading && !wifiError)
      return <Progress animated color="info" value={100} />;
    else return <Alert color="info">{t("noWifi")}</Alert>;

  let submit = e => {
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
