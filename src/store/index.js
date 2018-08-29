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
    exits: [],
    exitsError: null,
    loading: false,
    info: { balance: 0 },
    neighbors: [],
    neighborsError: null,
    page: "",
    success: false,
    wifiSettings: []
  },
  actions: {
    ...daoActions,
    ...exitActions,
    ...neighborActions,
    ...wifiActions,
    changePage: (_, page) => ({ page: page }),

    getInfo: async () => {
      return { info: await backend.getInfo() };
    },

    getSettings: async ({ setState, state }) => {
      setState({ settings: await backend.getSettings() });
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
