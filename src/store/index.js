import { initStore } from "react-stateful";
import Backend from "../libs/backend";

const backend = new Backend();

const store = {
  initialState: {
    exits: [],
    info: { balance: 0 },
    neighborData: [],
    page: "",
    wifiSettings: []
  },
  actions: {
    changePage: (_, page) => ({ page: page }),
    getExits: async ({ setState, state }) => {
      setState({ exits: await backend.getExits() });
    },
    getInfo: async () => {
      return { info: await backend.getInfo() };
    },
    getNeighborData: async ({ state }) => {
      return { neighborData: await backend.getNeighborData() };
    },
    getSettings: async ({ setState, state }) => {
      setState({ settings: await backend.getSettings() });
    },
    getWifiSettings: async ({ state }) => {
      return { wifiSettings: await backend.getWifiSettings() };
    },
    registerExit: async ({ setState, state }, nickname, email) => {
      await backend.registerExit(nickname, email);
    },
    resetExit: async ({ setState, state }, nickname) => {
      await backend.resetExit(nickname);
    },
    requestExitConnection: async ({ setState, state }, nickname) => {
      await backend.requestExitConnection(nickname);
      setState({ settings: await backend.getSettings() });
    },
    saveWifiSetting: async ({ state, setState }, setting) => {
      setState({
        wifiSettings: state.wifiSettings.map(s => {
          return s;
        })
      });
      await backend.setWifiSettings(setting);
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
