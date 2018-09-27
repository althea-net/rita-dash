export default backend => {
  return {
    getWifiSettings: async ({ setState, state }) => {
      setState({ loading: true });
      let res = await backend.getWifiSettings();
      if (res instanceof Error) {
        let error =
          res.message === "502" ? state.t("serverError") : state.t("wifiError");
        return setState({
          error,
          exits: [],
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
