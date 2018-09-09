import i18n from "../i18n";
const t = i18n.t.bind(i18n);

export default backend => {
  return {
    addSubnetDao: async ({ setState, state }, address) => {
      await backend.addSubnetDao(address);
      setState({ daos: await backend.getSubnetDaos() });
    },
    getSubnetDaos: async ({ setState, state }) => {
      if (!state.daos.length) {
        setState({ loading: true });
      }
      let daos = await backend.getSubnetDaos();
      if (daos instanceof Error) {
        return setState({
          daosError: t("daoError"),
          daos: [],
          loading: false
        });
      }
      setState({ daosError: null, daos, loading: false });
    },
    removeSubnetDao: async ({ setState, state }, address) => {
      await backend.removeSubnetDao(address);
      setState({ daos: await backend.getSubnetDaos() });
    }
  };
};
