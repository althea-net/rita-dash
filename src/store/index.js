import { initStore } from "react-stateful";
import Backend from "../libs/backend";
import {
  DaoActions,
  ExitActions,
  NeighborActions,
  RouterActions
} from "./actions";

const backend = new Backend();

const initialSettings = {
  network: {
    meshIp: null
  },
  payment: {
    ethAddress: null
  }
};

const store = {
  initialState: {
    daos: [],
    daosError: null,
    error: null,
    exits: null,
    exitsError: null,
    loadingInterfaces: null,
    loadingSettings: false,
    loading: null,
    info: { balance: 0, version: "" },
    interfaces: null,
    neighbors: null,
    neighborsError: null,
    page: "",
    port: null,
    settings: initialSettings,
    success: false,
    t: () => {},
    wifiError: null,
    wifiSettings: null
  },
  actions: {
    ...DaoActions(backend),
    ...ExitActions(backend),
    ...NeighborActions(backend),
    ...RouterActions(backend),

    changePage: (_, page) => ({ error: "", loading: false, page: page }),
    init: async ({ setState, state }, t) => {
      setState({ t });
    },

    getInfo: async ({ setState, state }) => {
      setState({ loading: true });

      let info = await backend.getInfo();

      if (info instanceof Error) {
        return {
          error: state.t("infoError"),
          loading: false
        };
      }

      return { loading: false, info };
    },

    getSettings: async ({ setState, state }) => {
      let settings = await backend.getSettings();
      if (state.loadingSettings) return;

      setState({ loadingSettings: true });

      if (settings instanceof Error) {
        return {
          error: state.t("settingsError"),
          loadingSettings: false,
          settings: initialSettings
        };
      }

      return { error: null, loadingSettings: false, settings };
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
