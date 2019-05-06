import cckd from "camelcase-keys-deep";
import { useEffect, useState } from "react";
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
    resetting: [],
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

let { protocol, hostname } = window.location;

if (protocol === "file:") {
  protocol = "http:";
  hostname = "192.168.10.1";
}

const port = 4877;
const base =
  process.env.REACT_APP_BACKEND_URL || `${protocol}//${hostname}:${port}`;

const AbortController = window.AbortController;

export async function get(url, camel = true, timeout = 10000, signal) {
  const controller = new AbortController();
  signal = signal || controller.signal;

  let timer = setTimeout(() => controller.abort(), timeout);
  let res;

  try {
    res = await fetch(base + url, { signal });
  } catch (e) {
    if (e.name === "AbortError") throw e;
    return e;
  }

  clearTimeout(timer);

  if (!res.ok) return new Error(res.status);

  let clone = res.clone();
  try {
    let json = await res.json();
    if (json && json.error) {
      return new Error(json.error);
    }
    if (camel) json = cckd(json);
    return json;
  } catch (e) {
    return clone.text();
  }
}

export async function post(url, data, camel = true) {
  const res = await fetch(base + url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error(res.status);

  let clone = res.clone();
  try {
    let json = await res.json();
    if (json && json.error) {
      throw new Error(json.error);
    }
    if (camel) json = cckd(json);
    return json;
  } catch (e) {
    return clone.text();
  }
}

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    },
    [delay, value]
  );

  return debouncedValue;
}
