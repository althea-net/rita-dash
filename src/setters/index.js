export const initState = { page: "", wifiSettings: [], neighborData: [] };

export const setters = {
  changePage: state => page => {
    console.log("changePage");
    return {
      ...state,
      page: page
    };
  },
  gotWifiSettings: state => wifiSettings => {
    console.log("gotWifiSettings");
    return {
      ...state,
      wifiSettings: wifiSettings
    };
  },
  savedWifiSetting: state => wifiSetting => {
    return {
      ...state,
      wifiSettings: state.wifiSettings.map(s => {
        if (s.device_name === wifiSetting.device_name) {
          return wifiSetting;
        }
        return s;
      })
    };
  },
  gotNeighborData: state => neighborData => {
    console.log("gotNeighborData");
    return {
      ...state,
      neighborData: neighborData
    };
  },
};
