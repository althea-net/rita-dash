import { initStore } from "react-stateful";
import Backend from "../libs/backend";

const backend = new Backend();

const store = {
  initialState: {
    daos: [],
    error: null,
    exits: [],
    loading: false,
    info: { balance: 0 },
    neighborData: [],
    page: "",
    success: false,
    wifiSettings: []
  },
  actions: {
    addSubnetDao: async ({ setState, state }, address) => {
      await backend.addSubnetDao(address);
      setState({ daos: await backend.getSubnetDaos() });
    },
    changePage: (_, page) => ({ page: page }),
    getExits: async ({ setState, state }) => {
      if (!state.exits.length) {
        setState({ loading: true });
      }
      let exits = await backend.getExits();
      if (exits instanceof Error) {
        return setState({
          error: "Problem connecting to rita server",
          exits: [],
          loading: false
        });
      }
      setState({ error: null, exits, loading: false });
    },
    getSubnetDaos: async ({ setState, state }) => {
      if (!state.daos.length) {
        setState({ loading: true });
      }
      let daos = await backend.getSubnetDaos();
      if (daos instanceof Error) {
        return setState({
          error: "Problem connecting to rita server",
          daos: [],
          loading: false
        });
      }
      setState({ error: null, daos, loading: false });
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
    getWifiSettings: async ({ setState, state }) => {
      setState({ loading: true });
      let res = await backend.getWifiSettings();
      if (res instanceof Error) {
        return setState({
          error: "Problem connecting to rita server",
          exits: [],
          loading: false
        });
      }
      setState({ error: null, wifiSettings: res, loading: false });
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
    saveWifiSetting: async ({ state, setState }, setting, radio) => {
      setState({
        loading: radio
      });

      await backend.setWifiSettings(setting);
      setState({ loading: false, success: radio });
    },
    toggleWifiMesh: async ({ setState, state }, radio, mesh) => {
      setState({ loading: true });
      await backend.toggleWifiMesh(radio, mesh);
      setState({ loading: false });
    },
    verifyExit: async ({ setState, state }, nickname, code) => {
      await backend.verifyExit(nickname, code);
      await backend.selectExit(nickname);
      setState({ exits: await backend.getExits() });
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
