import { initStore } from "react-stateful";
import FakeBackend from "../libs/backend";

const backend = new FakeBackend("url");

const store = {
  initialState: {
    page: "",
    wifiSettings: [],
    neighborData: [],
<<<<<<< HEAD
    info: { balance: 0 },
    settings: { payment: {} }
=======
    info: { balance: 0 }
>>>>>>> ef4c48c635988ff9333b065c1ff52c1411a8693e
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
<<<<<<< HEAD
    },
    getSettings: async () => {
      const settings = await backend.getSettings();
      console.log("SZETTINGS", settings);
      return { settings };
=======
>>>>>>> ef4c48c635988ff9333b065c1ff52c1411a8693e
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
