import { initStore } from "react-stateful";
import Backend from "../libs/backend";

const backend = new Backend();

const store = {
  initialState: {
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
    changePage: (_, page) => ({ page: page }),
    getExits: async ({ setState, state }) => {
      if (!state.exits.length) {
        setState({ loading: true });
      }
      let exits = await backend.getExits();
      if (exits instanceof Error) {
        return setState({
          error: "Getting exits failed",
          exits: [],
          loading: false
        });
      }
      setState({ error: null, exits, loading: false });
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
