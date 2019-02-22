import { initStore } from "react-stateful";
import {
  DaoActions,
  ExitActions,
  GeneralActions,
  NeighborActions,
  RouterActions,
  PaymentActions
} from "./actions";

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
    blockchain: null,
    blockchainSuccess: false,
    channels: null,
    daoAddress: null,
    daos: [],
    daosError: null,
    error: null,
    exits: null,
    exitsError: null,
    factor: 0,
    factorError: null,
    initializing: true,
    ipAddress: null,
    loadingBlockchain: false,
    loadingExits: null,
    loadingInterfaces: null,
    loadingIp: null,
    loadingPrice: false,
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
    portChange: false,
    price: 0,
    priceError: null,
    scanning: false,
    settings: initialSettings,
    symbol: null,
    success: false,
    t: () => {},
    version: true,
    versionError: null,
    waiting: 0,
    wifiChange: null,
    wifiError: null,
    wifiSettings: null,
    withdrawalError: null,
    withdrawalSuccess: false
  },
  actions: {
    ...GeneralActions,
    ...DaoActions,
    ...ExitActions,
    ...NeighborActions,
    ...PaymentActions,
    ...RouterActions,

    changePage: (_, page) => ({
      error: "",
      initializing: true,
      loading: false,
      page: page
    }),

    init: async ({ setState, state }, t) => {
      setState({ t });
    }
  }
};

export const {
  Provider,
  Consumer,
  actions,
  getState,
  connect,
  subscribe,
  Context
} = initStore(store);
