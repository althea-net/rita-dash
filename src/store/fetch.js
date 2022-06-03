import cckd from "camelcase-keys-deep";
import { useEffect, useState } from "react";

let { protocol, hostname } = window.location;

if (protocol === "file:") {
  protocol = "http:";
  hostname = "192.168.10.1";
}

const port = 4877;
const base =
  process.env.REACT_APP_BACKEND_URL || `${protocol}//${hostname}:${port}`;

const AbortController = window.AbortController;

export async function get(url, camel = true, timeout = 10000) {
  const controller = new AbortController();
  const signal = controller.signal;

  let timer = setTimeout(() => controller.abort(), timeout);
  let res;

  try {
    res = await fetch(base + url, { signal });
  } catch (e) {
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
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) return new Error((await res.json()).error);

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [delay, value]);

  return debouncedValue;
}
