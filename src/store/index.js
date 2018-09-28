import { initStore } from "react-stateful";
import Backend from "../libs/backend";
import DaoActions from "./DaoActions";
import ExitActions from "./ExitActions";
import NeighborActions from "./NeighborActions";
import WifiActions from "./WifiActions";

const backend = new Backend();

const daoActions = DaoActions(backend);
const exitActions = ExitActions(backend);
const neighborActions = NeighborActions(backend);
const wifiActions = WifiActions(backend);

const store = {
  initialState: {
    daos: [],
    daosError: null,
    error: null,
    exits: [],
    exitsError: null,
    loading: false,
    info: { balance: 0, version: "" },
    neighbors: [],
    neighborsError: null,
    page: "",
    settings: {
      network: {
        ownIp: null
      },
      payment: {
        ethAddress: null
      }
    },
    success: false,
    t: () => {},
    wifiSettings: []
  },
  actions: {
    ...daoActions,
    ...exitActions,
    ...neighborActions,
    ...wifiActions,
    changePage: (_, page) => ({ error: "", page: page }),
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
      setState({ loading: true });

      let settings = await backend.getSettings();

      if (settings instanceof Error) {
        return {
          error: state.t("settingsError"),
          loading: false
        };
      }

      return { loading: false, settings };
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
