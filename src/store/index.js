import { initStore } from "react-stateful";
import Backend from "../libs/backend";
import DaoActions from "./DaoActions";
import ExitActions from "./ExitActions";
import NeighborActions from "./NeighborActions";
import RouterActions from "./RouterActions";

const backend = new Backend();

const daoActions = DaoActions(backend);
const exitActions = ExitActions(backend);
const neighborActions = NeighborActions(backend);
const routerActions = RouterActions(backend);

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
    loadingInterfaces: false,
    loadingSettings: false,
    loading: false,
    info: { balance: 0, version: "" },
    interfaces: null,
    neighbors: null,
    neighborsError: null,
    page: "",
    port: null,
    settings: initialSettings,
    success: false,
    t: () => {},
    wifiSettings: null
  },
  actions: {
    ...daoActions,
    ...exitActions,
    ...neighborActions,
    ...routerActions,
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
