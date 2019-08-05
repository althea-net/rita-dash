import cckd from "camelcase-keys-deep";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useReducer
} from "react";

import actions from "./actions";
import { sha3_512 } from "js-sha3";
import { BigNumber } from "bignumber.js";

const state = {
  address: null,
  authenticated: true,
  autoPricing: false,
  balance: null,
  backupCreated: false,
  blockchain: null,
  channels: [],
  closeThreshold: null,
  daoAddress: null,
  debt: new BigNumber("0"),
  debts: [],
  device: null,
  exitIp: null,
  exits: [],
  exitSelected: false,
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

export async function login(password) {
  let url = "/info";
  let salt = "RitaSalt";
  let Authorization = "Basic " + btoa("rita:" + sha3_512(password + salt));

  let res = await fetch(base + url, { headers: { Authorization } });
  let json = await res.json();

  window.sessionStorage.setItem("Authorization", Authorization);

  return json;
}

export async function get(url, camel = true, timeout = 10000, signal) {
  const controller = new AbortController();
  signal = signal || controller.signal;

  let timer = setTimeout(() => controller.abort(), timeout);
  let res;

  let Authorization = window.sessionStorage.getItem("Authorization");
  let headers = { Authorization };

  try {
    res = await fetch(base + url, { headers, signal });
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
  let Authorization = window.sessionStorage.getItem("Authorization");
  let headers = {
    Accept: "application/json",
    Authorization,
    "Content-Type": "application/json"
  };

  const res = await fetch(base + url, {
    method: "POST",
    body: JSON.stringify(data),
    headers
  });

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
