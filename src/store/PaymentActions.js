import { BigNumber } from "bignumber.js";

const weiPerEth = BigNumber("1000000000000000000");
const bytesPerGb = BigNumber("1000000000");

export default backend => {
  return {
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

      let price = BigNumber(res.localFee.toString())
        .times(bytesPerGb)
        .div(weiPerEth)
        .toFixed(8);

      return { price };
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
    }
  };
};
