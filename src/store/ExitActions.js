const actions = backend => {
  return {
    getExits: async ({ setState, state }) => {
      if (state.loading) return;
      setState({ initializing: false, loading: true });

      let exits = await backend.getExits();
      if (exits instanceof Error) {
        return setState({
          exitsError: state.t("exitsError"),
          exits: null,
          initializing: false,
          loading: false
        });
      }

      const sort = (a, b) =>
        a.nickname.localeCompare(b.nickname, undefined, {
          sensitivity: "base"
        });

      exits = exits
        .filter(
          exit =>
            exit.exitSettings.generalDetails.exitCurrency === state.blockchain
        )
        .sort(sort);

      setState({
        exitsError: null,
        exits,
        initializing: false,
        loading: false
      });
    },
    registerExit: async ({ setState, state }, nickname, email) => {
      await backend.registerExit(nickname, email);
      if (!email) await backend.selectExit(nickname);
      setState({ exits: await backend.getExits() });
    },
    resetExit: async ({ setState, state }, nickname) => {
      await backend.resetExit(nickname);
      setState({ exits: await backend.getExits() });
    },
    selectExit: async ({ setState, state }, nickname) => {
      await backend.selectExit(nickname);
      setState({ exits: await backend.getExits() });
    },
    verifyExit: async ({ setState, state }, nickname, code) => {
      await backend.verifyExit(nickname, code);
      await backend.selectExit(nickname);
      setState({ exits: await backend.getExits() });
    }
  };
};

export default actions;
