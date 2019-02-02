export default backend => {
  return {
    getInterfaces: async ({ setState, state }) => {
      if (state.loadingInterfaces) return;
      setState({ initializing: false, loadingInterfaces: true });

      let res = await backend.getInterfaces();
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
      if (!port && interfaces.length > 0) {
        port = interfaces.sort()[0];
        setState({ port });
      }

      return {
        error: null,
        initializing: false,
        interfaces,
        loadingInterfaces: false
      };
    },

    setInterface: async ({ state, setState }, mode) => {
      let interfaces = state.interfaces;
      interfaces[state.port] = mode;
      setState({ interfaces });
      await backend.setInterface(state.port, mode);
    },

    setPort: async ({ state, setState }, port) => {
      return { port };
    },

    getWifiSettings: async ({ setState, state }) => {
      if (state.loadingWifi) return;

      setState({ initializing: false, loadingWifi: true, success: null });

      let settings = await backend.getWifiSettings();
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
          channels[radio] = await backend.getChannels(radio);
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

    saveWifiSetting: async ({ state, setState }, setting, radio) => {
      let { wifiSettings } = state;

      setState({
        loading: radio
      });

      await backend.setWifiSettings(setting);
      let i = wifiSettings.findIndex(
        s => s.device.sectionName === setting.device.sectionName
      );
      wifiSettings[i] = setting;
      return { loading: false, success: radio, wifiSettings };
    }
  };
};
