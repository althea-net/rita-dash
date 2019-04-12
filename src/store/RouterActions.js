import { get, post } from "./fetch";

export default {
  getInterfaces: async ({ setState, state }) => {
    if (state.loadingInterfaces) return;
    setState({ initializing: false, loadingInterfaces: true });

    let res = await get("/interfaces", false);
    if (res instanceof Error) {
      return setState({
        error: state.t("interfacesError"),
        initializing: false,
        interfaces: null,
        loadingInterfaces: false
      });
    }

    /*eslint no-sequences: 0*/
    let interfaces = Object.keys(res)
      .filter(i => !i.startsWith("wlan"))
      .reduce((a, b) => ((a[b] = res[b]), a), {});

    let port = state.port;
    if (!port && Object.keys(interfaces).length > 0) {
      port = Object.keys(interfaces)[0];
      setState({ port });
    }

    return {
      error: null,
      initializing: false,
      interfaces,
      loadingInterfaces: false
    };
  },

  setInterface: async ({ state, setState }, iface, mode) => {
    let interfaces = state.interfaces;
    interfaces[iface] = mode;
    setState({ interfaces });
    await post("/interfaces", { interface: iface, mode });
  },

  setPort: async ({ state, setState }, port) => {
    return { port };
  },

  startPortChange: async ({ state, setState }, port) => {
    setState({ portChange: true });
  },

  getWifiSettings: async ({ setState, state }) => {
    if (state.loadingWifi) return;

    setState({ initializing: false, loadingWifi: true, success: null });

    let settings = await get("/wifi_settings");
    if (settings instanceof Error) {
      let wifiError, loadingWifi;
      if (settings.message === "502") {
        wifiError = state.t("serverwifiError");
        loadingWifi = null;
      } else {
        wifiError = state.t("wifiwifiError");
        loadingWifi = false;
      }
      return setState({
        initializing: false,
        wifiError,
        wifiSettings: null,
        loadingWifi
      });
    }

    let channels = {};
    await Promise.all(
      settings.map(async setting => {
        let radio = setting.device.sectionName;
        channels[radio] = [];
        try {
          channels[radio] = await get(`/wifi_settings/get_channels/${radio}`);
        } catch (e) {}
        return channels[radio];
      })
    );

    return {
      channels,
      initializing: false,
      wifiError: null,
      wifiSettings: settings,
      loadingWifi: false
    };
  },

  saveWifiSettings: async ({ state, setState }, wifiSettings) => {
    setState({
      loadingWifi: true,
      success: false,
      wifiChange: true,
      wifiError: false
    });

    try {
      let data = [];

      wifiSettings.map(async setting => {
        let radio = setting.device.sectionName;
        let { ssid, key } = setting;
        let channel = parseInt(setting.device.channel, 10);

        data.push({ WifiChannel: { radio, channel } });
        data.push({ WifiSSID: { radio, ssid } });
        data.push({ WifiPass: { radio, pass: key } });
      });

      await post("/wifi_settings", data);
    } catch (e) {
      return { loadingWifi: false, wifiError: e.message };
    }

    return { loadingWifi: false, success: true, wifiSettings };
  }
};
