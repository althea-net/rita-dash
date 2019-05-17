import { BigNumber } from "bignumber.js";

const symbols = {
  Ethereum: "ETH",
  Rinkeby: "tETH",
  Xdai: "USD"
};

export default (state, action) => {
  const { type, ...data } = action;
  const actions = {
    debt: ({ debts }) => {
      const selectedExit = state.exits.find(e => e.isSelected);

      if (selectedExit) {
        return {
          debt: debts.reduce((a, b) => {
            return b.identity.meshIp === selectedExit.exitSettings.id.meshIp
              ? a.plus(BigNumber(b.paymentDetails.debt.toString()))
              : a;
          }, BigNumber("0"))
        };
      }
    },
    blockchain: ({ blockchain }) => ({
      blockchain,
      symbol: symbols[blockchain]
    }),
    info: ({
      info: {
        address,
        balance,
        closeThreshold,
        device,
        lowBalance,
        ritaVersion,
        version
      }
    }) => ({
      address,
      balance,
      closeThreshold,
      device,
      lowBalance,
      ritaVersion,
      version,
      waiting: state.portChange ? state.waiting : 0
    }),
    meshIp: ({ meshIp }) => ({ meshIp }),
    keepWaiting: () => ({
      portChange: state.portChange && state.waiting >= 1,
      waiting: state.waiting - 1
    }),
    interfaces: ({ interfaces }) => ({
      interfaces: Object.keys(interfaces)
        .filter(i => !i.startsWith("wlan"))
        /*eslint no-sequences: 0*/
        .reduce((a, b) => ((a[b] = interfaces[b]), a), {})
    }),
    startPortChange: () => ({ portChange: true }),
    startWaiting: () => ({ waiting: 120 }),
    wifiChange: () => ({ wifiChange: true })
  };

  if (actions[type]) return { ...state, ...actions[type]({ ...data }) };
  else return state;
};
