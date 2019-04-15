import { get, post } from "./fetch";
import { BigNumber } from "bignumber.js";

const weiPerEth = BigNumber("1000000000000000000");
const bytesPerGb = BigNumber("1000000000");
const symbols = {
  Ethereum: "ETH",
  Rinkeby: "tETH",
  Xdai: "USD"
};

export async function getBlockchain({ setState, state }) {
  setState({ loadingBlockchain: true, blockchainSuccess: false });
  let res = await get("/blockchain/get/");
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
    let res = await get("/metric_factor");

    if (res instanceof Error) {
      return setState({
        factorError: state.t("factorError")
      });
    }

    return { factor: res.metricFactor };
  },

  getPrice: async ({ setState, state }) => {
    let res = await get("/local_fee");

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
    let autoPricing = await get("/auto_price/enabled");
    return { autoPricing };
  },

  toggleAutoPricing: async ({ setState, state }) => {
    let { autoPricing } = state;
    let loadingPrice = false;

    autoPricing = !autoPricing;
    await post(`/auto_price/enabled/${autoPricing}`);
    if (autoPricing) loadingPrice = true;

    return { autoPricing, loadingPrice };
  },

  setFactor: async ({ setState, state }, factor) => {
    let res = await get("/metric_factor");

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

    let res = await post(`/local_fee/${priceWei}`);

    if (res instanceof Error) {
      return setState({
        priceError: state.t("priceSetError")
      });
    }

    return { loadingPrice: true };
  },

  setBlockchain: async ({ setState, state }, blockchain) => {
    setState({ loadingBlockchain: true });
    let res = await post(`/blockchain/set/${blockchain}`);

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
    setState({ withdrawalSuccess: false });

    let res = await post(`/withdraw/${address}/${amount}`);

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
