export default backend => {
  return {
    joinSubnetDao: async ({ setState, state }, contractAddress, ipAddress) => {
      // for now we only support joining one DAO at a time so
      // just clear the list before joining
      await Promise.all(
        state.daos.map(async d => await backend.removeSubnetDao(d))
      );

      await backend.addSubnetDao(contractAddress);
      await backend.setMeshIp(ipAddress);
    },

    getMeshIp: async ({ setState, state }) => {
      let { meshIp } = await backend.getMeshIp();
      return { meshIp };
    },

    getSubnetDaos: async ({ setState, state }) => {
      if (!state.daos.length) {
        setState({ loading: true });
      }
      let daos = await backend.getSubnetDaos();
      if (daos instanceof Error) {
        return setState({
          daosError: state.t("daoError"),
          daos: [],
          loading: false
        });
      }

      return { daosError: null, daos, loading: false };
    },

    removeSubnetDao: async ({ setState, state }, address) => {
      await backend.removeSubnetDao(address);
      setState({ daos: await backend.getSubnetDaos() });
    }
  };
};
