import { BigNumber } from "bignumber.js";

const symbols = {
  Ethereum: "ETH",
  Rinkeby: "tETH",
  Xdai: "USD"
};

export default (state, action) => {
  const { type, ...data } = action;
  const actions = {
    blockchain: ({ blockchain }) => ({
      blockchain,
      symbol: symbols[blockchain]
    }),
    debt: ({ debts }) => {
      const selectedExit = state.exits.find(e => e.isSelected);

      if (selectedExit && debts.length) {
        return {
          debt: debts.reduce((a, b) => {
            return b.identity.meshIp === selectedExit.exitSettings.id.meshIp
              ? a.plus(BigNumber(b.paymentDetails.debt.toString()))
              : a;
          }, BigNumber("0")),
          debts
        };
      }

      return state;
    },
    authenticated: ({ authenticated }) => ({ authenticated }),
    exits: ({ exits }) => ({ exits }),
    info: ({
      info: {
        address,
        balance,
        closeThreshold,
        device,
        localFee,
        lowBalance,
        ritaVersion,
        version
      }
    }) => ({
      address,
      balance,
      closeThreshold,
      device,
      localFee,
      lowBalance,
      ritaVersion,
      version,
      waiting: state.portChange || state.keyChange ? state.waiting : 0
    }),
    meshIp: ({ meshIp }) => ({ meshIp }),
    keepWaiting: () => ({
      keyChange: state.keyChange && state.waiting >= 1,
      portChange: state.portChange && state.waiting >= 1,
      waiting: state.waiting - 1
    }),
    interfaces: ({ interfaces }) => ({
      interfaces: Object.keys(interfaces)
        .filter(i => !i.startsWith("wlan"))
        /*eslint no-sequences: 0*/
        .reduce((a, b) => ((a[b] = interfaces[b]), a), {})
    }),
    neighbors: ({ neighbors }) => {
      return {
        neighbors: neighbors
          .filter(n => {
            return !state.exits.find(
              e =>
                e.exitSettings &&
                e.exitSettings.id.meshIp === n.ip.replace(/"/g, "")
            );
          })
          .map(n => {
            n.debt = state.debts.find(
              d => d.identity.meshIp === n.ip.replace(/"/g, "")
            );
            return n;
          })
      };
    },
    startKeyChange: () => ({ keyChange: true }),
    startPortChange: () => ({ portChange: true }),
    startWaiting: ({ waiting }) => ({ waiting }),
    usage: ({ usage }) => ({ usage }),
    wgPublicKey: ({ wgPublicKey }) => ({ wgPublicKey }),
    wifiChange: () => ({ wifiChange: true }),
    withdrawSuccess: ({ txid }) => ({ txid })
  };

  if (actions[type]) return { ...state, ...actions[type]({ ...data }) };
  else return state;
};
