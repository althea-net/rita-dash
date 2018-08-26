export default backend => {
  return {
    getExits: async ({ setState, state }) => {
      if (!state.exits.length) {
        setState({ loading: true });
      }
      let exits = await backend.getExits();
      if (exits instanceof Error) {
        return setState({
          error: "Problem connecting to rita server",
          exits: [],
          loading: false
        });
      }
      setState({ error: null, exits, loading: false });
    },
    registerExit: async ({ setState, state }, nickname, email) => {
      await backend.registerExit(nickname, email);
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
