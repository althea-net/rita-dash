import React from "react";
import { useTranslation } from "react-i18next";
import { FormGroup, Input, Label, CustomInput } from "reactstrap";
import { useStore } from "store";

const WifiSettingsForm = ({ index }) => {
  const [t] = useTranslation();
  const [{ channels, security, wifiSettings }, dispatch] = useStore();

  const settings = wifiSettings[index];

  const radioType = settings.device.radioType;
  const radio = settings.device.sectionName;

  const ssidValid = settings.ssid.length >= 8;
  const keyValid = settings.key.length >= 8;

  const saveSettings = () => {
    wifiSettings[index] = settings;
    dispatch({
      type: "wifiSettings",
      wifiSettings: JSON.parse(JSON.stringify(wifiSettings)),
    });
  };

  const setSSID = (e) => {
    settings.ssid = e.target.value;
    saveSettings();
  };

  const setKey = (e) => {
    settings.key = e.target.value;
    saveSettings();
  };

  const setChannel = (e) => {
    settings.device.channel = e.target.value;
    saveSettings();
  };

  const setDisabled = (e) => {
    settings.device.disabled = e.target.checked ? "1" : "0";
    saveSettings();
  };

  const setSecurity = (e) => {
    settings.encryption = e.target.value;
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
            id={"ssid_" + radio}
            placeholder="min. 8 characters"
            invalid={!ssidValid}
            onChange={setSSID}
            value={settings.ssid}
          />
        </FormGroup>
        <FormGroup className="pr-2 mb-0">
          <Label for="password">{t("networkPassword")}</Label>
          <Input
            type="text"
            name="key"
            id={"key_" + radio}
            placeholder="min. 8 characters"
            invalid={!keyValid}
            onChange={setKey}
            value={settings.key}
          />
        </FormGroup>
        <FormGroup className="pr-2 mb-0">
          <Label for="channel">{t("channel")}</Label>
          <Input
            type="select"
            name="channel"
            id={"channel_" + radio}
            onChange={setChannel}
            value={settings.device.channel}
          >
            {channels[radio] &&
              channels[radio].length &&
              channels[radio].map((c) => <option key={c}>{c}</option>)}
          </Input>
        </FormGroup>
        <FormGroup className="pr-3 mb-0">
          <Label for="sec">{t("wifiSecMode")}</Label>
          <Input
            type="select"
            id={"security_" + radio}
            name="security"
            onChange={setSecurity}
            value={settings.encryption}
          >
            {security[radio] &&
              security[radio].length &&
              security[radio].map((c) => <option key={c}>{c}</option>)}
          </Input>
        </FormGroup>
        <FormGroup className="pr-2 mb-0">
          <Label for="dis">{t("disabled")}</Label>
          <CustomInput
            type="checkbox"
            id={"disabled_" + radio}
            name="dis"
            label=""
            onChange={setDisabled}
            checked={settings.device.disabled === "1"}
          />
        </FormGroup>
      </div>
    </>
  );
};

export default WifiSettingsForm;
