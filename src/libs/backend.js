// @ts-check
import cckd from "camelcase-keys-deep";

const { protocol, hostname } = window.location;
const port = 4877;
const base =
  process.env.REACT_APP_BACKEND_URL || `${protocol}//${hostname}:${port}`;

async function get(url, camel = true) {
  const res = await fetch(base + url);
  if (!res.ok) return new Error(res.status);
  try {
    let json = await res.json();
    if (json && json.error) {
      throw new Error(json.error);
    }
    if (camel) json = cckd(json);
    return json;
  } catch (e) {
    return e;
  }
}

async function post(url, json) {
  await fetch(base + url, {
    method: "POST",
    body: JSON.stringify(json),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
}

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
      {}
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

  async addSubnetDao(address) {
    return post(`/dao_list/add/${address}`);
  }

  async getMeshIp() {
    return get("/mesh_ip");
  }

  async setMeshIp(mesh_ip) {
    return post("/mesh_ip", { mesh_ip });
  }

  async getInterfaces() {
    return get("/interfaces", false);
  }

  async setInterface(iface, mode) {
    await post("/interfaces", { interface: iface, mode });
  }

  async getWifiSettings() {
    return get("/wifi_settings");
  }

  async setWifiSettings(settings) {
    const radio = settings.device.sectionName;
    const { ssid, key } = settings;

    await post("/wifi_settings/ssid", { radio, ssid });
    await post("/wifi_settings/pass", { radio, pass: key });
  }

  async getDebts() {
    return get("/debts");
  }

  async getExits() {
    return get("/exits");
  }

  async getSubnetDaos() {
    return get("/dao_list");
  }

  async getNeighbors() {
    return get("/neighbors");
  }

  async getSettings() {
    return get("/settings");
  }

  async getInfo() {
    return get("/info");
  }

  async registerExit(nickname, email) {
    await post(`/settings`, {
      exit_client: {
        reg_details: {
          email: email
        }
      }
    });

    return post(`/exits/${nickname}/register`);
  }

  async removeSubnetDao(address) {
    return post(`/dao_list/remove/${address}`);
  }

  async resetExit(nickname) {
    return post(`/exits/${nickname}/reset`);
  }

  async requestExitConnection(nickname) {
    return post("/settings", {
      exit_client: {
        current_exit: nickname
      }
    });
  }

  async selectExit(nickname) {
    return post(`/exits/${nickname}/select`);
  }

  async verifyExit(nickname, code) {
    return post(`/exits/${nickname}/verify/${code}`);
  }
}
