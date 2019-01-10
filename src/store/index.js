import { initStore } from "react-stateful";
import Backend from "../libs/backend";
import {
  DaoActions,
  ExitActions,
  NeighborActions,
  RouterActions,
  PaymentActions
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
    autoPricing: false,
    daoAddress: null,
    daos: [],
    daosError: null,
    depositing: false,
    error: null,
    exits: null,
    exitsError: null,
    factor: 0,
    factorError: null,
    initializing: true,
    loadingInterfaces: null,
    loadingIp: null,
    loadingSettings: false,
    loadingVersion: false,
    loading: null,
    info: { balance: 0, device: null, version: "" },
    interfaces: null,
    meshIp: null,
    neighbors: null,
    neighborsError: null,
    page: "",
    port: null,
    price: 0,
    priceError: null,
    scanning: false,
    settings: initialSettings,
    success: false,
    t: () => {},
    version: true,
    versionError: null,
    waiting: 0,
    wifiError: null,
    wifiSettings: null,
    withdrawing: false,
    withdrawalError: null,
    withdrawalSuccess: false
  },
  actions: {
    ...DaoActions(backend),
    ...ExitActions(backend),
    ...NeighborActions(backend),
    ...PaymentActions(backend),
    ...RouterActions(backend),

    changePage: (_, page) => ({
      error: "",
      initializing: true,
      loading: false,
      page: page
    }),

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
      if (state.loadingSettings) return;
      setState({ loadingSettings: true });

      let settings = await backend.getSettings();

      if (settings instanceof Error) {
        return {
          error: state.t("settingsError"),
          loadingSettings: false,
          settings: initialSettings
        };
      }

      return { error: null, loadingSettings: false, settings };
    },

    getVersion: async ({ setState, state }) => {
      if (state.loadingVersion) return;
      setState({ loadingVersion: true });

      let version = await backend.getVersion();

      if (version instanceof Error) {
        return {
          loadingVersion: false,
          version: false
        };
      }

      return { waiting: 0, loadingVersion: false, version: true };
    },

    startWaiting: async ({ setState, state }) => {
      return { waiting: 120 };
    },

    keepWaiting: async ({ setState, state }) => {
      let { waiting } = state;
      --waiting;
      return { waiting };
    },

    startScanning: async ({ setState, state }) => {
      document.querySelector(".App").style.display = "none";
      return { scanning: true };
    },

    stopScanning: async ({ setState, state }) => {
      window.QRScanner.destroy(s => {
        document.querySelector(".App").style.display = "block";
        document.querySelector("body").style.backgroundColor = "white";
      });

      return { scanning: false };
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
