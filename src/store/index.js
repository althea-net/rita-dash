import { initStore } from "react-stateful";
import Backend from "../libs/backend";

const backend = new Backend();
const j = {
  exit_client: {
    current_exit: "exit_a",
    exits: {
      exit_a: {
        general_details: {
          description: "just a normal althea exit",
          exit_price: 50,
          netmask: 24,
          server_internal_ip: "172.168.1.254",
          wg_exit_port: 59999
        },
        id: {
          eth_address: "0x0101010101010101010101010101010101010101",
          mesh_ip: "fd00::5",
          wg_public_key: "P6P9hncoqNT2Kt4qgmCJHQSWfwnXZhPFHXS8fyGSjXQ="
        },
        message: "Registration OK",
        our_details: { client_internal_ip: "172.168.1.101" },
        registration_port: 4875,
        state: "Registered"
      }
    },
    reg_details: { email: "1234@gmail.com", zip_code: "1234" },
    wg_listen_port: 59999
  },
  exit_tunnel_settings: { lan_nics: ["lo"] },
  network: {
    babel_port: 6872,
    bounty_ip: "fd00::3",
    bounty_port: 8888,
    default_route: [],
    manual_peers: [],
    own_ip: "fd00::1",
    peer_interfaces: ["veth-1-6"],
    rita_dashboard_port: 4877,
    rita_hello_port: 4876,
    wg_private_key: "OMve2YYGeVaZ0fxWhXURisKJLRt9v43fDukmKiL4uUQ=",
    wg_private_key_path:
      "/home/ben/src/althea_rs/integration-tests/private-key-1",
    wg_public_key: "CrWmFrWulpCAwhaT8TwGu4A1ojbhqY+YofH+4MxyWkg=",
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
const store = {
  initialState: {
    page: "",
    wifiSettings: [],
    neighborData: [],
    info: { balance: 0 }
  },
  actions: {
    changePage: (_, page) => ({ page: page }),
    getWifiSettings: async ({ state }) => {
      return { wifiSettings: await backend.getWifiSettings() };
    },
    saveWifiSetting: async ({ state, setState }, setting) => {
      setState({
        wifiSettings: state.wifiSettings.map(s => {
          if (s.device_name === setting.device_name) {
            return setting;
          }
          return s;
        })
      });
      await backend.setWifiSettings(setting);
    },
    getNeighborData: async ({ state }) => {
      return { neighborData: await backend.getNeighborData() };
    },
    getInfo: async () => {
      return { info: await backend.getInfo() };
    },
    requestExitConnection: async ({ state }, nickname) => {
      await backend.requestExitConnection(nickname);
    },
    getSettings: async () => {
      const settings = await backend.getSettings();
      return { settings };
    }
  }
};

export const {
  Provider,
  Consumer,
  actions,
  getState,
  connect,
  subscribe
} = initStore(store);
