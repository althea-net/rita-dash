// @ts-check
import cckd from "camelcase-keys-deep";

let { protocol, hostname } = window.location;

if (protocol === "file:") {
  protocol = "http:";
  hostname = "192.168.10.1";
}

const port = 4877;
const base =
  process.env.REACT_APP_BACKEND_URL || `${protocol}//${hostname}:${port}`;

const AbortController = window.AbortController;

async function get(url, camel = true, timeout = 10000) {
  const controller = new AbortController();
  const signal = controller.signal;

  let timer = setTimeout(() => controller.abort(), timeout);
  const res = await fetch(base + url, { signal });
  clearTimeout(timer);

  if (!res.ok) throw new Error(res.status);

  let clone = res.clone();
  try {
    let json = await res.json();
    if (json && json.error) {
      return new Error(json.error);
    }
    if (camel) json = cckd(json);
    return json;
  } catch (e) {
    return clone.text();
  }
}

async function post(url, data, camel = true) {
  const res = await fetch(base + url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

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

export default class Backend {
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
    let { ssid, key, channel } = settings;
    channel = parseInt(channel, 10);

    await post("/wifi_settings/ssid", { radio, ssid });
    await post("/wifi_settings/pass", { radio, pass: key });
    await post("/wifi_settings/channel", { radio, channel });
  }

  async getChannels(radio) {
    return get(`/wifi_settings/get_channels/${radio}`);
  }

  async setChannel(radio, channel) {
    return post("/wifi_settings/get_channels", { radio, channel });
  }

  async getDebts() {
    return get("/debts", true, 300000);
  }

  async getExits() {
    return cckd([
      {
        nickname: "south_america",
        exit_settings: {
          id: {
            mesh_ip: "fd00::1337:e7f",
            eth_address: "0x72d9e579f691d62aa7e0703840db6dd2fa9fae21",
            wg_public_key: "V0tgdQ2Ljx5xyw4UMQ6a7ZztQmyvqrUp/4jrFcCeG1w="
          },
          registration_port: 4875,
          description: "South American exit",
          state: "GotInfo",
          general_details: {
            server_internal_ip: "172.168.0.254",
            netmask: 16,
            wg_exit_port: 59999,
            exit_price: 300000,
            exit_currency: "Xdai",
            description: "South America",
            verif_mode: "Email"
          },
          message: "Got info successfully",
          auto_register: false
        },
        is_selected: false,
        have_route: false,
        is_reachable: false,
        is_tunnel_working: false
      },
      {
        nickname: "borked",
        exit_settings: {
          id: {
            mesh_ip: "fd00::1337:e6f",
            eth_address: "0x72d9e579f691d62aa7e0703840db6dd2fa9fae21",
            wg_public_key: "4f3TBCL2HxxPreajT+FsAYzmQa0ZmeYYNHvpORX9tm8="
          },
          registration_port: 4875,
          description: "Borked! For developers only!",
          state: "GotInfo",
          general_details: {
            server_internal_ip: "172.168.0.254",
            netmask: 16,
            wg_exit_port: 59999,
            exit_price: 300000,
            exit_currency: "Rinkeby",
            description: "Not just unstable, Borked!",
            verif_mode: "Email"
          },
          message: "Got info successfully",
          auto_register: false
        },
        is_selected: true,
        have_route: true,
        is_reachable: true,
        is_tunnel_working: false
      },
      {
        nickname: "us_west",
        exit_settings: {
          id: {
            mesh_ip: "fd00::1337:e2f",
            eth_address: "0x72d9e579f691d62aa7e0703840db6dd2fa9fae21",
            wg_public_key: "jkIodvXKgij/rAEQXFEPJpls6ooxXJEC5XlWA1uUPUg="
          },
          registration_port: 4875,
          description: "The Althea Production US exit",
          state: "GotInfo",
          general_details: {
            server_internal_ip: "172.168.0.254",
            netmask: 16,
            wg_exit_port: 59999,
            exit_price: 300000,
            exit_currency: "Ethereum",
            description: "Stable exit for America",
            verif_mode: "Email"
          },
          message: "Got info successfully",
          auto_register: false
        },
        is_selected: false,
        have_route: true,
        is_reachable: true,
        is_tunnel_working: false
      },
      {
        nickname: "test",
        exit_settings: {
          id: {
            mesh_ip: "fd00::1337:e1f",
            eth_address: "0x72d9e579f691d62aa7e0703840db6dd2fa9fae21",
            wg_public_key: "hw2rXXaIOfbcOXbvejB3AyuoSAb3QhPXjC5MwxRqkls="
          },
          registration_port: 4875,
          description: "The Althea testing exit. Unstable!",
          state: "GotInfo",
          general_details: {
            server_internal_ip: "172.168.0.254",
            netmask: 16,
            wg_exit_port: 59999,
            exit_price: 300000,
            exit_currency: "Ethereum",
            description: "Unstable test exit for NA",
            verif_mode: "Email"
          },
          message: "Got info successfully",
          auto_register: false
        },
        is_selected: false,
        have_route: true,
        is_reachable: true,
        is_tunnel_working: false
      }
    ]);
    // return get("/exits", true, 5000);
  }

  async getFactor() {
    return get("/metric_factor");
  }

  async getNeighbors() {
    return get("/neighbors");
  }

  async getPrice() {
    return get("/local_fee");
  }

  async getAutoPricing() {
    return fetch(base + "/auto_price/enabled");
  }

  async getBlockchain() {
    return get("/blockchain/get/");
  }

  async getSettings() {
    return get("/settings");
  }

  async getSubnetDaos() {
    return get("/dao_list");
  }

  async getVersion() {
    return get("/version");
  }

  async getInfo() {
    return get("/info");
  }

  async registerExit(nickname, email) {
    if (email) {
      await post(`/settings`, {
        exit_client: {
          reg_details: {
            email: email
          }
        }
      });
    } else {
      await post(`/exits/${nickname}/register`);
    }

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

  async setFactor(factor) {
    return post(`/metric_factor/${factor}`);
  }

  async setBlockchain(blockchain) {
    return post(`/blockchain/set/${blockchain}`);
  }

  async setPrice(price) {
    return post(`/local_fee/${price}`);
  }

  async setAutoPricing(enabled) {
    return post(`/auto_price/enabled/${enabled}`);
  }

  async withdraw(address, amount) {
    return post(`/withdraw/${address}/${amount}`);
  }

  async verifyExit(nickname, code) {
    return post(`/exits/${nickname}/verify/${code}`);
  }
}
