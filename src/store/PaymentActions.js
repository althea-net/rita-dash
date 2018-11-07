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

      return { price: res.localFee };
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
      let res = await backend.setPrice(price);

      if (res instanceof Error) {
        return setState({
          priceError: state.t("priceSetError")
        });
      }
    }
  };
};
