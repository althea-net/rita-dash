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
          error: "Problem connecting to rita server",
          daos: [],
          loading: false
        });
      }
      setState({ error: null, daos, loading: false });
    },
    removeSubnetDao: async ({ setState, state }, address) => {
      await backend.removeSubnetDao(address);
      setState({ daos: await backend.getSubnetDaos() });
    }
  };
};
