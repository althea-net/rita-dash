import { BigNumber } from "bignumber.js";
import Backend from "../libs/backend";
const backend = new Backend();

const weiPerEth = BigNumber("1000000000000000000");
const bytesPerGb = BigNumber("1000000000");
const symbols = {
  Ethereum: "ETH",
  Rinkeby: "tETH",
  Xdai: "DAI"
};

export async function getBlockchain({ setState, state }) {
  setState({ loadingBlockchain: true });
  let res = await backend.getBlockchain();
  let blockchain = res;
  let symbol = symbols[blockchain];
  return {
    blockchain,
    loadingBlockchain: false,
    symbol
  };
}

export default {
  getBlockchain,

  getFactor: async ({ setState, state }) => {
    let res = await backend.getFactor();

    if (res instanceof Error) {
      return setState({
        factorError: state.t("factorError")
      });
    }

    return { factor: res.metricFactor };
  },

  getPrice: async ({ setState, state }) => {
    let res = await backend.getPrice();

    if (res instanceof Error) {
      return setState({
        priceError: state.t("priceError")
      });
    }

    let price = parseFloat(
      BigNumber(res.localFee.toString())
        .times(bytesPerGb)
        .div(weiPerEth)
        .toFixed(8)
    );

    return { price, loadingPrice: false };
  },

  clearBlockchainSuccess: async () => {
    return { blockchainSuccess: false };
  },

  getAutoPricing: async ({ setState, state }) => {
    let res = await backend.getAutoPricing();
    return { autoPricing: await res.json() };
  },

  toggleAutoPricing: async ({ setState, state }) => {
    let { autoPricing } = state;
    let loadingPrice = false;

    autoPricing = !autoPricing;
    await backend.setAutoPricing(autoPricing);
    if (autoPricing) loadingPrice = true;

    return { autoPricing, loadingPrice };
  },

  setFactor: async ({ setState, state }, factor) => {
    let res = await backend.setFactor(factor);

    if (res instanceof Error) {
      return setState({
        factorError: state.t("factorSetError")
      });
    }
  },

  setPrice: async ({ setState, state }, price) => {
    let priceWei = BigNumber(price.toString())
      .times(weiPerEth)
      .div(bytesPerGb)
      .toFixed(0);

    let res = await backend.setPrice(priceWei);

    if (res instanceof Error) {
      return setState({
        priceError: state.t("priceSetError")
      });
    }

    return { loadingPrice: true };
  },

  setBlockchain: async ({ setState, state }, blockchain) => {
    setState({ loadingBlockchain: true });
    let res = await backend.setBlockchain(blockchain);

    if (res instanceof Error) {
      return setState({
        blockchainError: state.t("blockchainError")
      });
    }

    let symbol = symbols[blockchain];
    return {
      blockchain,
      loadingBlockchain: false,
      blockchainSuccess: true,
      symbol
    };
  },

  withdraw: async ({ setState, state }, address, amount) => {
    let res = await backend.withdraw(address, amount);

    if (res instanceof Error) {
      return setState({
        withdrawalError: state.t("withdrawalError")
      });
    }

    let txid = res.replace("txid:", "");

    return {
      withdrawalSuccess: `Withdrawal completed with txid: ${txid}`
    };
  }
};
