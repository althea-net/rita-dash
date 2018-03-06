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

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default class Backend {
  constructor(url) {
    this.url = url;
    this.wifiSettings = [
      {
        device_name: "2.4GHz Bandwidth",
        mesh: false,
        ssid: "MyWifiAP",
        encryption: "psk2",
        key: "secret passphrase"
      },
      {
        device_name: "5GHz Bandwidth",
        mesh: false,
        ssid: "MyWifiAP 5ghz",
        encryption: "psk2",
        key: "secret passphrase"
      }
    ];
    this.neighborData = [
      {
        name: "Cindy Barker",
        linkCost: 1168,
        routeMetricToExit: Infinity,
        currentDebt: -12,
        totalDebt: 0
      },
      {
        name: "CascadianMesh Tower2",
        linkCost: 1020,
        routeMetricToExit: 958,
        priceToExit: 12,
        currentDebt: 10,
        totalDebt: 0
      },
      {
        name: "Bobnet",
        linkCost: 4355,
        routeMetricToExit: 1596,
        currentDebt: -5,
        totalDebt: -230
      },
      {
        name: "Verizon",
        linkCost: 10781,
        routeMetricToExit: 958,
        priceToExit: 200,
        currentDebt: 1000,
        totalDebt: 100
      }
    ];
  }

  // GET | POST /wifi_iface
  //
  // {
  //   device: "2.4ghz",
  //   mesh: false,
  //   ssid: "MyWifiAP",
  //   encryption: "psk2",
  //   key: "secret passphrase"
  // }
  //

  async getWifiSettings() {
    await timeout(100);
    return this.wifiSettings;
  }

  async setWifiSettings(settings) {
    // isWifiSettings(settings);
    await timeout(100);
    this.wifiSettings.map(s => {
      if (s.device_name === settings.device_name) {
        return settings;
      } else {
        return s;
      }
    });
  }

  async getNeighborData() {
    await timeout(100);
    return this.neighborData;
  }
}
