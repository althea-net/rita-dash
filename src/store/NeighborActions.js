export default backend => {
  return {
    getNeighbors: async ({ setState, state }) => {
      if (!state.neighbors.length) {
        setState({ loading: true });
      }

      let exits = await backend.getExits();

      if (exits instanceof Error) {
        return {
          neighboursError: "Problem retrieving exit information",
          loading: false
        };
      }

      let neighbors = await backend.getNeighbors();

      if (neighbors instanceof Error) {
        return {
          neighborsError: "Problem retrieving neighbors",
          loading: false
        };
      }

      exits.map(exit => {
        neighbors.map(n => {
          n.nickname = n.nickname.replace(new RegExp(`"`, "g"), "");
          if (n.nickname === exit.exitSettings.id.meshIp) {
            n.nickname = exit.nickname;
            n.isExit = true;
          }
          return n;
        });
        return exit;
      });

      return { loading: false, neighbors };
    }
  };
};
