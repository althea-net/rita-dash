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
    this.settings = {
      exit_client: {
        exit_ip: "fd96::1337:e1f",
        exit_registration_port: 4875,
        reg_details: {
          email: "1234@gmail.com",
          zip_code: "1234"
        },
        wg_listen_port: 59999
      },
      exit_tunnel_settings: {
        lan_nics: ["lan"]
      },
      network: {
        babel_port: 6872,
        bounty_ip: "fd96::1337:e1f",
        bounty_port: 8888,
        default_route: [],
        manual_peers: ["test.altheamesh.com"],
        own_ip: "fdaa:5dac:e37d:4a31:28e:1ede:590a:ee28",
        peer_interfaces: ["eth0.4", "wlan1", "eth0.3", "eth0.5", "wlan0"],
        rita_dashboard_port: 4877,
        rita_hello_port: 4876,
        wg_private_key: "CLUA7Q4zUjz5iwzrw1iuSKXStyrHU0LGZ0mrRAHa0H0=",
        wg_private_key_path: "/tmp/priv",
        wg_public_key: "q2ccDUJnyHpyTvRhudoYIlZ/xOrMhy/ygTEJhz1ZlxI=",
        wg_start_port: 60000
      },
      payment: {
        buffer_period: 3,
        close_fraction: "100",
        close_threshold: "-1000000000",
        eth_address: "0x0101010101010101010101010101010101010101",
        pay_threshold: "0"
      }
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

  async getWifiSettings() {
    const res = await fetch("http://192.168.2.1:4877/wifi_settings");
    const json = await res.json();
    return json;
  }

  async setWifiSettings(settings) {
    post("http://192.168.2.1:4877/wifi_settings", settings);
  }

  async getNeighborData() {
    const res = await fetch("http://192.168.2.1:4877/neighbors");
    const json = await res.json();
    return json;
  }

  async getInfo() {
    const res = await fetch("http://192.168.2.1:4877/info");
    const json = await res.json();
    return json;
  }
  async getSettings() {
    const res = await fetch("http://192.168.2.1:4877/settings");
    const json = await res.json();
    return json;
  }
}
