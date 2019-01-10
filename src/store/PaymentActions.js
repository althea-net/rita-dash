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

      let price = parseFloat(
        BigNumber(res.localFee.toString())
          .times(bytesPerGb)
          .div(weiPerEth)
          .toFixed(8)
      );

      return { price };
    },

    getAutoPricing: async ({ setState, state }) => {
      let res = await backend.getAutoPricing();
      return { autoPricing: await res.json() };
    },

    toggleAutoPricing: async ({ setState, state }) => {
      let { autoPricing } = state;
      autoPricing = !autoPricing;
      await backend.setAutoPricing(autoPricing);

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

      return { autoPricing, price };
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
    },

    startDepositing: async ({ setState, state }) => {
      return { depositing: true };
    },

    stopDepositing: async ({ setState, state }) => {
      return { depositing: false };
    },

    startWithdrawing: async ({ setState, state }) => {
      return { withdrawing: true };
    },

    stopWithdrawing: async ({ setState, state }) => {
      return { withdrawing: false };
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
        withdrawalSuccess: `Withdrawal completed with txid: ${txid}`,
        withdrawing: false
      };
    }
  };
};
