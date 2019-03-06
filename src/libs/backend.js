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
  let res;

  try {
    res = await fetch(base + url, { signal });
  } catch (e) {
    return e;
  }

  clearTimeout(timer);

  if (!res.ok) return new Error(res.status);

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

  async setChannel(radio, channel) {
    return post("/wifi_settings/get_channels", { radio, channel });
  }

  async getDebts() {
    return get("/debts", true, 300000);
  }

  async getExits() {
    return get("/exits", true, 5000);
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
