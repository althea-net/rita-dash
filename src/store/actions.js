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
    backupCreated: ({ backupCreated }) => ({ backupCreated }),
    exits: ({ exits }) => {
      let { resetting } = state;
      const resetOccurred =
        exits.length &&
        state.resetting &&
        exits
          .filter(
            e =>
              e.exitSettings.state === "Pending" ||
              e.exitSettings.state === "GotInfo"
          )
          .map(e => resetting.includes(e.nickname)).length;

      if (resetOccurred) resetting = [];
      return { exits, resetting };
    },
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
      waiting: state.portChange ? state.waiting : 0
    }),
    meshIp: ({ meshIp }) => ({ meshIp }),
    keepWaiting: () => ({
      portChange: state.portChange && state.waiting >= 1,
      wifiChange: state.wifiChange && state.waiting >= 1,
      waiting: Math.max(state.waiting - 1, 0)
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
    exitIp: ({ exitIp }) => ({ exitIp }),
    reset: ({ nickname }) => ({
      resetting: [...state.resetting, nickname]
    }),
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
