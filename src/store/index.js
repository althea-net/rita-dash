import { initStore } from "react-stateful";
import Backend from "../libs/backend";

const backend = new Backend();

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
    registerExit: async ({ setState, state }, nickname) => {
      // TODO
    },
    requestExitConnection: async ({ setState, state }, nickname) => {
      await backend.requestExitConnection(nickname);
      setState({ settings: await backend.getSettings() });
    },
    getSettings: async ({ setState, state }) => {
      setState({ settings: await backend.getSettings() });
    },
    toggleWifiMesh: async ({ setState, state }, radio) => {
      await backend.toggleWifiMesh(radio);
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
