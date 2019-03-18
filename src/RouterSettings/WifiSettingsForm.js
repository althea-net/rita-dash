import React from "react";
import { useTranslation } from "react-i18next";
import { FormGroup, Input, Label } from "reactstrap";

const WifiSettingsForm = ({
  index,
  wifiSettings,
  setWifiSettings,
  submitting,
  channels
}) => {
  let [t] = useTranslation();

  let settings = wifiSettings[index];

  let radioType = settings.device.radioType;
  let radio = settings.device.sectionName;

  let ssidValid = settings.ssid.length >= 8;
  let keyValid = settings.key.length >= 8;

  let saveSettings = () => {
    wifiSettings[index] = settings;
    setWifiSettings(JSON.parse(JSON.stringify(wifiSettings)));
  };

  let setSSID = e => {
    settings.ssid = e.target.value;
    saveSettings();
  };

  let setKey = e => {
    settings.key = e.target.value;
    saveSettings();
  };

  let setChannel = e => {
    settings.device.channel = e.target.value;
    saveSettings();
  };

  return (
    <>
      <h4 className="mb-0">{t(radioType)}</h4>
      <div className="d-flex flex-wrap mb-4 mt-0">
        <FormGroup id="form" className="pr-2 mb-0">
          <Label for="ssid">{t("ssid")}</Label>
          <Input
            type="text"
            name="ssid"
            placeholder="min. 8 characters"
            invalid={submitting && !ssidValid}
            onChange={setSSID}
            value={settings.ssid}
          />
        </FormGroup>
        <FormGroup className="pr-2 mb-0">
          <Label for="password">{t("networkPassword")}</Label>
          <Input
            type="text"
            name="key"
            placeholder="min. 8 characters"
            invalid={submitting && !keyValid}
            onChange={setKey}
            value={settings.key}
          />
        </FormGroup>
        <FormGroup className="pr-2 mb-0">
          <Label for="channel">{t("channel")}</Label>
          <Input
            type="select"
            name="channel"
            onChange={setChannel}
            value={settings.device.channel}
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
