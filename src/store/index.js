import { initStore } from "react-stateful";
import Backend from "../libs/backend";
import DaoActions from "./DaoActions";
import ExitActions from "./ExitActions";
import NeighborActions from "./NeighborActions";
import WifiActions from "./WifiActions";
import i18n from "../i18n";

const backend = new Backend();

const daoActions = DaoActions(backend);
const exitActions = ExitActions(backend);
const neighborActions = NeighborActions(backend);
const wifiActions = WifiActions(backend);
const t = i18n.t.bind(i18n);

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
    wifiSettings: []
  },
  actions: {
    ...daoActions,
    ...exitActions,
    ...neighborActions,
    ...wifiActions,
    changePage: (_, page) => ({ page: page }),

    getInfo: async ({ setState, state }) => {
      setState({ loading: true });

      let info = await backend.getInfo();

      if (1) {
        return {
          error: t("infoError"),
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
          error: "Problem retrieving settings",
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
