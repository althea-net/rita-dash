import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, FormGroup, Input, Label, Progress } from "reactstrap";
import { Context } from "store";

const WifiSettingsForm = ({ index, wifiSettings, setSettings, submitting }) => {
  let [t] = useTranslation();

  let settings = wifiSettings[index];
  let [ssid, setSSID] = useState(settings.ssid);
  let [key, setKey] = useState(settings.key);
  let [channel, setChannel] = useState(settings.device.channel);

  let newSettings = wifiSettings;
  newSettings[index] = { ...newSettings[index], ssid, key, channel };
  setSettings(newSettings);

  let radioType = settings.device.radioType;
  let radio = settings.device.sectionName;

  let {
    state: { loadingWifi, success, channels }
  } = useContext(Context);

  let ssidValid = ssid.length >= 8;
  let keyValid = key.length >= 8;

  return (
    <>
      {success === radioType && (
        <Alert color="success">{t("settingsSaved")}</Alert>
      )}
      {loadingWifi === radioType && (
        <Progress animated color="info" value="100" />
      )}
      <h4 className="mb-0">{t(radioType)}</h4>
      <div className="d-flex flex-wrap mb-4 mt-0">
        <FormGroup id="form" className="pr-2 mb-0">
          <Label for="ssid">{t("ssid")}</Label>
          <Input
            type="text"
            name="ssid"
            placeholder="min. 8 characters"
            invalid={submitting && !ssidValid}
            onChange={e => setSSID(e.target.value)}
            value={ssid}
          />
        </FormGroup>
        <FormGroup className="pr-2 mb-0">
          <Label for="password">{t("networkPassword")}</Label>
          <Input
            type="text"
            name="key"
            placeholder="min. 8 characters"
            invalid={submitting && !keyValid}
            onChange={e => setKey(e.target.value)}
            value={key}
          />
        </FormGroup>
        <FormGroup className="pr-2 mb-0">
          <Label for="channel">{t("channel")}</Label>
          <Input
            type="select"
            id={radio + "-channel"}
            name="channel"
            onChange={e => setChannel(e.target.value)}
            value={channel}
          >
            {channels[radio] &&
              channels[radio].length &&
              channels[radio].map(c => <option key={c}>{c}</option>)}
          </Input>
        </FormGroup>
      </div>
    </>
  );
};

export default WifiSettingsForm;
