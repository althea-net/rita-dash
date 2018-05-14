// @ts-check

function post(url, json) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(json),
    headers: new Headers({ "Content-Type": "application/json" })
  });
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default class Backend {
  constructor(url) {
    this.url = url;
    this.info = {
      balance: 87
    };
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
    // await timeout(100);
    // return this.wifiSettings;
    const res = await fetch("http://192.168.1.1:4877/wifi_settings");
    const json = await res.json();
    return json;
  }

  async getInfo() {
    await timeout(100);
    return this.info;
  }

  async setWifiSettings(settings) {
    // isWifiSettings(settings);
    // await timeout(100);
    // this.wifiSettings.map(s => {
    //   if (s.device_name === settings.device_name) {
    //     return settings;
    //   } else {
    //     return s;
    //   }
    // });
    post("http://192.168.1.1:4877/wifi_settings", settings);
  }

  async getNeighborData() {
    const res = await fetch("http://192.168.1.1:4877/neighbors");
    const json = await res.json();
    return json;
  }

  async getBalanceData() {
    const res = await fetch("http://192.168.1.1:4877/info");
    const json = await res.json();
    return json;
  }
}
