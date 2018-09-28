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
      setState({ error: null, interfaces: res, loading: false });
    },
    setInterfaces: async ({ state, setState }, interfaces) => {
      await backend.setInterfaces(interfaces);
      setState({ loading: false });
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
