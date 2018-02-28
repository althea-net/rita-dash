import Ubus from "../libs/fakeUbus.js";

const ubus = new Ubus("config.ubusUrl");

export async function fetchUciConfigs(store) {
  const configNames = ["wireless", "tunneldigger"];
  const configs = {};

  await Promise.all(
    configNames.map(async config => {
      const { values } = await callUbus(store, "uci", "get", { config });
      configs[config] = values;
    })
  );

  store.setters.gotUciConfigs(configs);
}

export async function callUbus(store, object, method, args) {
  const sessionID = localStorage.getItem("sessionID") || null;

  try {
    return ubus.call(sessionID, object, method, args);
  } catch (e) {
    if (e.message.match(/session_expired/)) {
      logout(store);
    } else {
      throw e;
    }
  }
}

export async function logout(store) {
  const sessionID = localStorage.getItem("sessionID");
  if (sessionID) {
    await callUbus(store, "session", "destroy", { sessionID });
  }
  localStorage.setItem("sessionID", null);

  store.setters.loggedOut();
}
