import { isRequired, isOptional, isObjectOf, label } from "nested-validate";
import { isNumber, isString, isBoolean } from "core-util-is";

const isEncryptionType = type => isString(type) && /(psk2|psk|wep)/.test(type);

const isDeviceName = isRequired(isString);

const isWifiSettings = isObjectOf({
  device_name: isDeviceName,
  mesh: isOptional(isBoolean),
  ssid: isOptional(isString),
  encryption: isOptional(isEncryptionType),
  key: isOptional(isString)
});

export default class Backend {
  constructor(url) {
    this.url = url;
  }

  // GET | POST /wifi_iface
  //
  // {
  //   device: "2.4ghz"
  //   mesh: false
  //   ssid: "MyWifiAP",
  //   encryption: "psk2",
  //   key: "secret passphrase"
  // }
  //

  getWifiSettings(deviceName) {
    isDeviceName(deviceName);
    fetch(this.url + "/wifiSettings", {
      body: { device_name: deviceName },
      method: "POST"
    });
  }

  setWifiSettings(settings) {
    isWifiSettings(settings);
    fetch(this.url + "/wifiSettings", settings);
  }
}
