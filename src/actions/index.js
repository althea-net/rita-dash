import FakeBackend from "../libs/fakeBackend";

const backend = new FakeBackend("url");

// export async function getWifiSettings(store) {
//   store.setters.gotWifiSettings(await backend.getWifiSettings());
// }

// export async function saveWifiSetting(store, setting) {
//   debugger;
//   store.setters.savedWifiSetting(setting);
//   debugger;
//   await backend.setWifiSettings(setting);
// }

export default {
  getWifiSettings: (setters, getState) => async () => {
    setters.gotWifiSettings(await backend.getWifiSettings());
  },
  saveWifiSetting: (setters, getState) => async setting => {
    console.log(getState());
    setters.savedWifiSetting(setting);
    console.log(getState());
    // await backend.setWifiSettings(setting);
  }
};
