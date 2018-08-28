import { initStore } from "react-stateful";
import Backend from "../libs/backend";
import DaoActions from "./DaoActions";
import ExitActions from "./ExitActions";
import WifiActions from "./WifiActions";

const backend = new Backend();

const daoActions = DaoActions(backend);
const exitActions = ExitActions(backend);
const wifiActions = WifiActions(backend);

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
    ...daoActions,
    ...exitActions,
    ...wifiActions,
    changePage: (_, page) => ({ page: page }),
    getInfo: async () => {
      return { info: await backend.getInfo() };
    },
    getNeighborData: async ({ state }) => {
      return { neighborData: await backend.getNeighborData() };
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
