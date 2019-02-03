const initialSettings = {
  network: {
    meshIp: null
  },
  payment: {
    ethAddress: null
  }
};

export default backend => {
  return {
    getInfo: async ({ setState, state }) => {
      setState({ loading: true });

      let info = await backend.getInfo();

      if (info instanceof Error) {
        return {
          error: state.t("infoError"),
          loading: false
        };
      }

      return { loading: false, info };
    },

    getSettings: async ({ setState, state }) => {
      if (state.loadingSettings) return;
      setState({ loadingSettings: true });

      let settings = await backend.getSettings();

      if (settings instanceof Error) {
        return {
          error: state.t("settingsError"),
          loadingSettings: false,
          settings: initialSettings
        };
      }

      return { error: null, loadingSettings: false, settings };
    },

    getVersion: async ({ setState, state }) => {
      if (state.loadingVersion) return;
      setState({ loadingVersion: true });

      let version = await backend.getVersion();
      if (version instanceof Error) {
        return {
          loadingVersion: false,
          version: null
        };
      }

      return {
        wifiChange: false,
        waiting: 0,
        loadingVersion: false,
        version,
        loadingWifi: false
      };
    },

    startWaiting: async ({ setState, state }) => {
      return { waiting: 120 };
    },

    keepWaiting: async ({ setState, state }) => {
      let { waiting } = state;
      --waiting;
      return { waiting };
    },

    startScanning: async ({ setState, state }) => {
      document.querySelector(".App").style.display = "none";
      return { scanning: true };
    },

    stopScanning: async ({ setState, state }) => {
      window.QRScanner.destroy(s => {
        document.querySelector(".App").style.display = "block";
        document.querySelector("body").style.backgroundColor = "white";
      });

      return { scanning: false };
    }
  };
};
