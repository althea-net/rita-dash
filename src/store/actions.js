/* eslint-disable import/no-anonymous-default-export */
import { BigNumber } from "bignumber.js";
import { toEth } from "utils";

const symbols = {
  Ethereum: "ETH",
  Rinkeby: "tETH",
  Xdai: "Dai",
};

export default (state, action) => {
  const { type, ...data } = action;

  const actions = {
    blockchain: ({ blockchain }) => ({
      blockchain,
      symbol: symbols[blockchain],
    }),
    channels: ({ channels }) => ({ channels }),
    security: ({ security }) => ({ security }),
    debt: ({ debts }) => {
      if (state.selectedExit && debts.length) {
        return {
          debt: debts.reduce((a, b) => {
            return b.wgPublicKey === state.selectedExit.exitSettings.wgPublicKey
              ? a.plus(BigNumber(b.paymentDetails.debt.toString()))
              : a;
          }, BigNumber("0")),
          debts,
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
            (e) =>
              e.exitSettings.state === "Pending" ||
              e.exitSettings.state === "GotInfo"
          )
          .map((e) => resetting.includes(e.nickname)).length;

      if (resetOccurred) resetting = [];

      const selectedExit = exits.find((exit) => {
        return (
          exit.isSelected &&
          exit.exitSettings.state === "Registered" &&
          exit.exitSettings.generalDetails.exitCurrency === state.blockchain
        );
      });

      let connectionStatus = "noConnection";
      if (selectedExit) {
        connectionStatus = selectedExit.isTunnelWorking
          ? "connected"
          : "connectionTrouble";
      }

      let counter = state.counter;
      if (
        connectionStatus === "connectionTrouble" &&
        state.connectionStatus === "connected"
      ) {
        counter += 1;
        if (counter < 5) connectionStatus = "connected";
      } else if (connectionStatus === "connected") {
        counter = 0;
      }

      return { connectionStatus, exits, selectedExit, resetting, counter };
    },
    firmwareUpgrading: ({ firmwareUpgrading }) => ({ firmwareUpgrading }),
    error: ({ error }) => ({ error }),
    info: ({
      info: {
        address,
        balance,
        closeThreshold,
        device,
        isGateway,
        localFee,
        lowBalance,
        ritaVersion,
        version,
      },
    }) => {
      let lastVersion = state.lastVersion;
      if (version) {
        if (lastVersion && version !== lastVersion && state.firmwareUpgrading) {
          window.localStorage.setItem("firmwareUpgraded", true);
          window.location.reload(true);
        }

        lastVersion = version;
      }

      return {
        address,
        balance,
        closeThreshold,
        device,
        isGateway,
        lastVersion,
        localFee,
        lowBalance,
        ritaVersion,
        version,
        waiting:
          !version || state.portChange || state.firmwareUpgrading
            ? state.waiting
            : 0,
      };
    },
    level: ({ level }) => ({ level }),
    meshIp: ({ meshIp }) => ({ meshIp }),
    keepWaiting: () => ({
      portChange: state.portChange && state.waiting >= 1,
      wifiChange: state.wifiChange && state.waiting >= 1,
      waiting: Math.max(state.waiting - 1, 0),
    }),
    interfaces: ({ interfaces }) => ({
      interfaces: Object.keys(interfaces)
        /*eslint no-sequences: 0*/
        .reduce((a, b) => ((a[b] = interfaces[b]), a), {}),
    }),
    neighbors: ({ neighbors }) => {
      return {
        neighbors: neighbors
          .filter((n) => {
            return !state.exits.find(
              (e) =>
                e.exitSettings &&
                e.exitSettings.wgPublicKey ===
                  n.id.wgPublicKey.replace(/"/g, "")
            );
          })
          .map((n) => {
            n.debt = state.debts.find(
              (d) =>
                d.identity.wgPublicKey === n.id.wgPublicKey.replace(/"/g, "")
            );
            return n;
          }),
      };
    },
    initialized: ({ initialized }) => ({ initialized }),
    nickname: ({ nickname }) => ({ nickname }),
    exitWg: ({ exitWg }) => ({ exitWg }),
    reset: ({ nickname }) => ({
      resetting: [...state.resetting, nickname],
    }),
    lightClientAP: ({ lightClientAP }) => ({ lightClientAP }),
    meshAP: ({ meshAP }) => ({ meshAP }),
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
          dest,
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
    withdrawSuccess: ({ txid }) => ({ txid }),
  };

  if (actions[type]) return { ...state, ...actions[type]({ ...data }) };
  else return state;
};
