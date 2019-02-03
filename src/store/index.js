import { initStore } from "react-stateful";
import Backend from "../libs/backend";
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

const backend = new Backend();

const store = {
  initialState: {
    autoPricing: false,
    blockchain: null,
    blockchainSuccess: false,
    channels: null,
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
    loadingBlockchain: false,
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
    withdrawing: false,
    withdrawalError: null,
    withdrawalSuccess: false
  },
  actions: {
    ...GeneralActions(backend),
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
