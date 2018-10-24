import { BigNumber } from "bignumber.js";
const wei = BigNumber("1000000000000000000");

export default backend => {
  return {
    getNeighbors: async ({ setState, state }) => {
      if (state.loading) return;
      setState({ initializing: false, loading: true });

      let debts = await backend.getDebts();

      if (debts instanceof Error) {
        return {
          error: state.t("debtsError"),
          initializing: false,
          loading: false
        };
      }

      let exits = state.settings.exitClient.exits;

      let neighbors = await backend.getNeighbors();

      if (neighbors instanceof Error) {
        return {
          error: state.t("neighborsError"),
          initializing: false,
          neighbors: [],
          loading: false
        };
      }

      neighbors.map(n => {
        n.nickname = n.nickname.replace(new RegExp(`"`, "g"), "");

        debts.map(d => {
          if (d.identity.meshIp === n.nickname) {
            let pd = d.paymentDetails;
            for (let k in pd) {
              pd[k] = BigNumber(pd[k])
                .dividedBy(wei)
                .toFixed(12)
                .toString();
            }
            Object.assign(n, pd);
          }

          return d;
        });

        for (let e in exits) {
          if (n.nickname === exits[e].id.meshIp) {
            n.nickname = exits[e].nickname;
            n.isExit = true;
          }
        }

        return n;
      });

      return { initializing: false, loading: false, neighbors };
    }
  };
};
