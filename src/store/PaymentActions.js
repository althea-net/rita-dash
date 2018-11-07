export default backend => {
  return {
    getFactor: async ({ setState, state }) => {
      let { metricFactor } = await backend.getFactor();
      return { factor: metricFactor };
    },

    getPrice: async ({ setState, state }) => {
      let { localFee } = await backend.getPrice();
      return { price: localFee };
    },

    setFactor: async ({ setState, state }, factor) => {
      await backend.setFactor(factor);
    },

    setPrice: async ({ setState, state }, price) => {
      await backend.setPrice(price);
    }
  };
};
