import FakeBackend from "../libs/fakeBackend";

const backend = new FakeBackend("url");

export async function getWifiSettings(store) {
  store.setters.gotWifiSettings(await backend.getWifiSettings());
}

export async function saveWifiSetting(store, setting) {
  store.setters.savedWifiSetting(setting);
  await backend.setWifiSettings(setting);
}
