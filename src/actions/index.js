import FakeBackend from "../libs/fakeBackend";

const backend = new FakeBackend("url");

export async function getWifiSettings(store) {
  store.setters.gotWifiSettings(await backend.getWifiSettings());
}

export async function setWifiSettings(store, settings) {
  store.setters.isLoading(true);
  await backend.setWifiSettings(settings);
  store.setters.isLoading(false);
}
