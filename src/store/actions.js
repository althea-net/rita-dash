import { BigNumber } from "bignumber.js";
import { toEth } from "utils";

const symbols = {
  Ethereum: "ETH",
  Rinkeby: "tETH",
  Xdai: "Dai"
};

export default (state, action) => {
  const { type, ...data } = action;
  const actions = {
    blockchain: ({ blockchain }) => ({
      blockchain,
      symbol: symbols[blockchain]
    }),
    channels: ({ channels }) => ({ channels }),
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

      const selectedExit = exits.find(exit => {
        let { state } = exit.exitSettings;
        return exit.isSelected && state === "Registered";
      });

      let connectionStatus = "noConnection";
      if (selectedExit) {
        connectionStatus = selectedExit.isTunnelWorking
          ? "connected"
          : "connectionTrouble";
      }

      return { connectionStatus, exits, selectedExit, resetting };
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
    }) => {
      let lastVersion;
      if (state.lastVersion && version !== state.lastVersion) window.location.reload();
      if (version) lastVersion = version;

      return {
        address,
        balance,
        closeThreshold,
        device,
        lastVersion,
        localFee,
        lowBalance,
        ritaVersion,
        version,
        waiting: state.portChange ? state.waiting : 0
      };
    },
    level: ({ level }) => ({ level }),
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
    initialized: ({ initialized }) => ({ initialized }),
    nickname: ({ nickname }) => ({ nickname }),
    exitIp: ({ exitIp }) => ({ exitIp }),
    reset: ({ nickname }) => ({
      resetting: [...state.resetting, nickname]
    }),
    remoteAccess: ({ remoteAccess }) => ({ remoteAccess }),
    remoteLogging: ({ remoteLogging }) => ({ remoteLogging }),
    sellingBandwidth: ({ sellingBandwidth }) => {
      window.localStorage.setItem("sellingBandwidth", sellingBandwidth);
      return { sellingBandwidth };
    },
    startPortChange: () => ({ portChange: true }),
    startWaiting: ({ waiting }) => ({ waiting }),
    status: ({ status }) => {
      try {
        let reserve, key, eth, dai, minEth, minDai, requiredEth, dest;
        key = Object.keys(status.state)[0];
        let state = status.state[key];
        let rate = toEth(state.weiPerDollar, 8);

        switch (key) {
          case "ethToDai":
            eth = toEth(state.amountOfEth);
            dai = eth / rate;
            break;
          case "daiToXdai":
          case "xdaiToDai":
            dai = parseFloat(toEth(state.amount));
            break;
          case "daiToEth":
            dai = parseFloat(toEth(state.amountOfDai));
            eth = (dai * rate).toFixed(4).toString();
            break;
          case "ethToDest":
            eth = toEth(state.amountOfEth);
            dai = eth / rate;
            dest = state.destAddress;
            break;
          default:
          case "noOp":
            eth = toEth(state.ethBalance);
            dai = eth / rate;
            break;
        }

        reserve = parseFloat(status.reserveAmount) * rate;
        minDai = parseFloat(status.minimumDeposit);
        minEth = minDai * rate;
        requiredEth = minEth - eth + 0.0001;

        dai = dai.toFixed(2).toString();
        minDai = minDai.toFixed(2).toString();
        minEth = minEth.toFixed(4).toString();
        requiredEth = requiredEth.toFixed(4).toString();
        status = {
          ...status,
          key,
          eth,
          dai,
          minDai,
          minEth,
          requiredEth,
          reserve,
          dest
        };

        return { status, withdrawChainSymbol: symbols[status.withdrawChain] };
      } catch (e) {
        console.log(e);
        return {};
      }
    },
    usage: ({ usage }) => ({ usage }),
    wgPublicKey: ({ wgPublicKey }) => ({ wgPublicKey }),
    wifiChange: () => ({ wifiChange: true }),
    wifiSettings: ({ wifiSettings }) => ({ wifiSettings }),
    withdrawSuccess: ({ txid }) => ({ txid })
  };

  if (actions[type]) return { ...state, ...actions[type]({ ...data }) };
  else return state;
};
