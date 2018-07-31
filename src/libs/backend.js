// @ts-check
import cckd from "camelcase-keys-deep";

async function get(url) {
  const res = await fetch(url);
  const json = await res.json();
  return cckd(json);
}

function post(url, json) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(json),
    headers: new Headers({ "Content-Type": "application/json" })
  });
}

const url = process.env.REACT_APP_BACKEND_URL;

export default class Backend {
  constructor(url) {
    this.url = url;
    this.info = {
      balance: 87
    };
    this.settings = {
      exit_client: {
        exit_list: [
          {
            fqdn: "test.altheamesh.com",
            mesh_ip: "fd96::1337:e1f",
            port: 89992,
            wg_key: "234n23o4n23o2n3r2r",
            status: "accepted"
          }
        ],
        selected_exit_fqdn: "fd96::1337:e1f",
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
        nickname: "fd00::2",
        route_metric_to_exit: 0,
        total_debt: 0,
        current_debt: 0,
        link_cost: 0,
        price_to_exit: 0
      },
      {
        nickname: "fd00::7",
        route_metric_to_exit: 0,
        total_debt: 0,
        current_debt: 0,
        link_cost: 0,
        price_to_exit: 0
      }
    ];
  }

  async getWifiSettings() {
    const res = await fetch(url + "/wifi_settings");
    const json = await res.json();
    return json;
  }

  async setWifiSettings(settings) {
    post(url + "/wifi_settings", settings);
  }

  async getNeighborData() {
    return get(url + "/neighbors");
  }

  async getSettings() {
    const res = await fetch(url + "/settings");
    const json = await res.json();
    return json;
  }

  async getInfo() {
    const res = await fetch(url + "/info");
    const json = await res.json();
    return json;
  }

  async requestExitConnection(nickname) {
    const res = await post(url + "/settings", {
      exit_client: {
        current_exit: nickname
      }
    });
    console.log(await res.text());
    // const json = await res.json();
    // return json;
  }
}
