export default backend => {
  return {
    getWifiSettings: async ({ setState, state }) => {
      setState({ loading: true });
      let res = await backend.getWifiSettings();
      if (res instanceof Error) {
        return setState({
          error: state.t("wifiError"),
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
