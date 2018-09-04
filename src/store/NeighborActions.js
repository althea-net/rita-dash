import { BigNumber } from "bignumber.js";

BigNumber.config({ DECIMAL_PLACES: 6 });
const wei = BigNumber("1000000000000000000");

export default backend => {
  return {
    getNeighbors: async ({ setState, state }) => {
      if (!state.neighbors.length) {
        setState({ loading: true });
      }

      let debts = await backend.getDebts();

      if (debts instanceof Error) {
        return {
          neighboursError: "Problem retrieving debts",
          loading: false
        };
      }

      let exits = await backend.getExits();

      if (exits instanceof Error) {
        return {
          neighboursError: "Problem retrieving exit information",
          loading: false
        };
      }

      let neighbors = await backend.getNeighbors();

      if (neighbors instanceof Error) {
        return {
          neighborsError: "Problem retrieving neighbors",
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
                .toString();
            }
            Object.assign(n, pd);
          }

          return d;
        });

        exits.map(e => {
          if (n.nickname === e.exitSettings.id.meshIp) {
            n.nickname = e.nickname;
            n.isExit = true;
          }

          return e;
        });

        return n;
      });

      return { loading: false, neighbors };
    }
  };
};
