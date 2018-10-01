export default backend => {
  return {
    getInterfaces: async ({ setState, state }) => {
      setState({ loading: true });
      let res = await backend.getInterfaces();
      if (res instanceof Error) {
        return setState({
          error: state.t("interfacesError"),
          interfaces: [],
          loading: false
        });
      }

      let port = null;
      if (Object.keys(res).length > 0) port = Object.keys(res).sort()[0];

      setState({ error: null, interfaces: res, loading: false, port });
    },

    setInterfaces: async ({ state, setState }, interfaces) => {
      await backend.setInterfaces(interfaces);
      setState({ loading: false });
    },

    setPort: async ({ state, setState }, port) => {
      setState({ port: port });
    },

    getWifiSettings: async ({ setState, state }) => {
      setState({ loading: true });
      let res = await backend.getWifiSettings();
      if (res instanceof Error) {
        let error =
          res.message === "502" ? state.t("serverError") : state.t("wifiError");
        return setState({
          error,
          wifiSettings: [],
          loading: false
        });
      }
      setState({ error: null, wifiSettings: res, loading: false });
    },

    saveWifiSetting: async ({ state, setState }, setting, radio) => {
      setState({
        loading: radio
      });

      await backend.setWifiSettings(setting);
      setState({ loading: false, success: radio });
    }
  };
};
