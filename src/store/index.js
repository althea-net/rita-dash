import cckd from "camelcase-keys-deep";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useReducer
} from "react";

import actions from "./actions";

const state = {
  address: null,
  autoPricing: false,
  balance: null,
  blockchain: null,
  closeThreshold: null,
  daoAddress: null,
  debts: [],
  device: null,
  exits: [],
  factor: 0,
  interfaces: null,
  localFee: null,
  lowBalance: false,
  meshIp: null,
  neighbors: [],
  port: null,
  portChange: false,
  resetting: [],
  ritaVersion: null,
  symbol: null,
  txid: null,
  usage: [],
  version: null,
  waiting: 0,
  wgPublicKey: null,
  wifiChange: null,
  wifiSettings: null
};

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

export const StateContext = createContext();
export const StateProvider = ({ children }) => (
  <StateContext.Provider value={useReducer(actions, state)}>
    {children}
  </StateContext.Provider>
);
export const useStore = () => useContext(StateContext);
