import { initStore } from "react-stateful";
import Backend from "../libs/backend";

const backend = new Backend();

const store = {
  initialState: {
    exits: [],
    info: { balance: 0 },
    neighborData: [],
    page: "",
    saved: {},
    saving: {},
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
      setState({ exits: await backend.getExits() });
    },
    resetExit: async ({ setState, state }, nickname) => {
      await backend.resetExit(nickname);
      setState({ exits: await backend.getExits() });
    },
    selectExit: async ({ setState, state }, nickname) => {
      await backend.selectExit(nickname);
      setState({ exits: await backend.getExits() });
    },
    saveWifiSetting: async ({ state, setState }, setting) => {
      const radio = setting.device.section_name;
      setState({ saving: { [radio]: true } });
      setState({
        wifiSettings: state.wifiSettings.map(s => {
          return s;
        })
      });
      await backend.setWifiSettings(setting);
      setState({ saving: { [radio]: false }, saved: { [radio]: true } });
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
