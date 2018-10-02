export default backend => {
  return {
    getInterfaces: async ({ setState, state }) => {
      if (state.loadingInterfaces) return;

      setState({ loadingInterfaces: true });

      let res = await backend.getInterfaces();
      if (res instanceof Error) {
        return setState({
          error: state.t("interfacesError"),
          interfaces: null,
          loadingInterfaces: false
        });
      }

      let port = state.port;
      if (!port && Object.keys(res).length > 0) {
        port = Object.keys(res).sort()[0];
        setState({ port });
      }

      return { error: null, interfaces: res, loadingInterfaces: false };
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
      if (state.loading) return;

      setState({ loading: true });

      let res = await backend.getWifiSettings();
      if (res instanceof Error) {
        let error =
          res.message === "502" ? state.t("serverError") : state.t("wifiError");
        return setState({
          error,
          wifiSettings: null,
          loading: false
        });
      }

      return { error: null, wifiSettings: res, loading: false };
    },

    saveWifiSetting: async ({ state, setState }, setting, radio) => {
      setState({
        loading: radio
      });

      await backend.setWifiSettings(setting);
      return { loading: false, success: radio };
    }
  };
};
