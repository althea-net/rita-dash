import { get, post } from "./fetch";

export default {
  joinSubnetDao: async ({ setState, state }, daoAddress, ipAddress) => {
    // for now we only support joining one DAO at a time so
    // just clear the list before joining
    await Promise.all(
      state.daos.map(address => post(`/dao_list/remove/${address}`))
    );

    let mesh_ip = ipAddress;

    await post(`/dao_list/add/${daoAddress}`);
    await post("/mesh_ip", { mesh_ip });

    return { daoAddress, ipAddress };
  },

  getMeshIp: async ({ setState, state }) => {
    let { meshIp } = await get("/mesh_ip");
    return { meshIp };
  },

  getSubnetDaos: async ({ setState, state }) => {
    if (!state.daos.length) {
      setState({ loading: true });
    }
    let daos = await get("/dao_list");
    if (daos instanceof Error) {
      return setState({
        daosError: state.t("daoError"),
        daos: [],
        loading: false
      });
    }

    let daoAddress;
    if (daos.length) daoAddress = daos[0];

    return { daosError: null, daos, daoAddress, loading: false };
  },

  removeSubnetDao: async ({ setState, state }, address) => {
    await post(`/dao_list/remove/${address}`);
    setState({ daos: await get("/dao_list") });
  }
};
