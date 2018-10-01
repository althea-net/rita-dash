import { BigNumber } from "bignumber.js";
const wei = BigNumber("1000000000000000000");

export default backend => {
  return {
    getNeighbors: async ({ setState, state }) => {
      if (state.loading) return;
      setState({ loading: true, neighbors: state.neighbors || [] });

      let debts = await backend.getDebts();

      if (debts instanceof Error) {
        return {
          error: state.t("debtsError"),
          loading: false
        };
      }

      let settings = await backend.getSettings();

      if (settings instanceof Error) {
        return {
          error: state.t("settingsError"),
          loading: false
        };
      }

      let exits = settings.exitClient.exits;

      let neighbors = await backend.getNeighbors();

      if (neighbors instanceof Error) {
        return {
          error: state.t("neighborsError"),
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

      return { loading: false, neighbors };
    }
  };
};
