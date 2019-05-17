import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { get, post, useStore } from "store";
import WifiSettingsForm from "./WifiSettingsForm";
import { Alert, Card, CardBody, Form, Button, Progress } from "reactstrap";
import { Error } from "utils";
import useInterval from "hooks/useInterval";

const Wifi = () => {
  const [t] = useTranslation();
  const [error, setError] = useState(null);
  const [wifiSettings, setWifiSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState({});
  const [wifiWaiting, setWifiWaiting] = useState(false);

  const [{ waiting }, dispatch] = useStore();

  useInterval(() => {
    if (wifiWaiting) dispatch({ type: "keepWaiting" });
  }, waiting ? 1000 : null);

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
          setError(t("error"));
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
    if (loading && !error)
      return <Progress animated color="info" value={100} />;
    else return <Alert color="info">{t("noWifi")}</Alert>;

  let submit = async e => {
    e.preventDefault();

    setWifiWaiting(true);
    dispatch({ type: "startWaiting" });

    try {
      let data = [];

      wifiSettings.map(setting => {
        let radio = setting.device.sectionName;
        let { ssid, key } = setting;
        let channel = parseInt(setting.device.channel, 10);

        data.push({ WifiChannel: { radio, channel } });
        data.push({ WifiSSID: { radio, ssid } });
        data.push({ WifiPass: { radio, pass: key } });

        return setting;
      });

      await post("/wifi_settings", data);
      dispatch({ type: "wifiChange" });
    } catch {}
  };

  let valid = wifiSettings.reduce(
    (a, b) => a && (b.ssid.length >= 8 && b.key.length >= 8),
    true
  );

  return (
    <Card>
      <CardBody>
        <Error error={error} />
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
