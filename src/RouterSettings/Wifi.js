import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { post, useStore } from "store";
import WifiSettingsForm from "./WifiSettingsForm";
import { Alert, Card, CardBody, Form, Button, Progress } from "reactstrap";
import { Error } from "utils";
import useWifiSettings from "hooks/useWifiSettings";
import useInterval from "hooks/useInterval";

const Wifi = () => {
  const [t] = useTranslation();
  const [wifiWaiting, setWifiWaiting] = useState(false);

  const [{ wifiSettings, waiting }, dispatch] = useStore();
  const [error, loading] = useWifiSettings();

  useInterval(() => {
    if (wifiWaiting) dispatch({ type: "keepWaiting" });
  }, waiting ? 1000 : null);

  if (!wifiSettings || !wifiSettings.length)
    if (loading && !error)
      return <Progress animated color="primary" value={100} />;
    else return <Alert color="info">{t("noWifi")}</Alert>;

  let submit = async e => {
    e.preventDefault();

    setWifiWaiting(true);
    dispatch({ type: "startWaiting", waiting: 120 });

    try {
      let data = [];

      wifiSettings.map(setting => {
        let radio = setting.device.sectionName;
        let { ssid, key } = setting;
        let channel = parseInt(setting.device.channel, 10);

        data.push({ WifiChannel: { radio, channel } });
        data.push({ WifiSsid: { radio, ssid } });
        data.push({ WifiPass: { radio, pass: key } });

        return setting;
      });

      await post("/wifi_settings", data);
      dispatch({ type: "wifiChange" });
    } catch {}
  };

  let valid = wifiSettings.reduce(
    (a, b) => a && (b.ssid.length >= 8 && b.key != null && b.key.length >= 8),
    true
  );

  return (
    <Card>
      <CardBody>
        <Error error={error} />
        <Form onSubmit={submit}>
          {wifiSettings.map((_, i) => (
            <WifiSettingsForm key={i} index={i} />
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
