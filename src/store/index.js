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
    ...wifiActions,
    changePage: (_, page) => ({ page: page }),

    getInfo: async () => {
      return { info: await backend.getInfo() };
    },

    getNeighborData: async ({ setState, state }) => {
      if (!state.neighbors.length) {
        setState({ loading: true });
      }

      let exits = await backend.getExits();

      if (exits instanceof Error) {
        return {
          neighboursError: "Problem retrieving exit information",
          loading: false
        };
      }

      let neighbors = await backend.getNeighbors();

      if (neighbors instanceof Error) {
        return {
          neighborsError: "Problem retrieving neighbors",
          loading: false
        };
      }

      exits.map(exit => {
        neighbors.map(n => {
          n.nickname = n.nickname.replace(`"`, "");
          if (n.nickname === exit.exitSettings.id.meshIp) {
            n.nickname = exit.nickname;
            n.isExit = true;
          }
          return n;
        });
        return exit;
      });

      return { neighbors };
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
