import { getBlockchain } from "./PaymentActions";
import Backend from "../libs/backend";
const backend = new Backend();

export async function getExits({ setState, state }, backend) {
  if (state.loading) return;
  setState({ initializing: false, loading: true });

  let { blockchain } = state;
  if (!blockchain)
    blockchain = (await getBlockchain({ setState, state })).blockchain;

  let exits = await backend.getExits();
  if (exits instanceof Error) {
    return setState({
      exitsError: state.t("exitsError"),
      exits: null,
      initializing: false,
      loading: false
    });
  }

  const sort = (a, b) => {
    a.nickname.localeCompare(b.nickname, undefined, {
      sensitivity: "base"
    });
  };

  exits = exits
    .filter(exit => {
      return (
        exit.exitSettings.generalDetails &&
        exit.exitSettings.generalDetails.exitCurrency === blockchain
      );
    })
    .sort(sort);

  setState({
    exitsError: null,
    exits,
    initializing: false,
    loading: false
  });
}

export default {
  getExits: async ({ setState, state }) => {
    getExits({ setState, state }, backend);
  },
  registerExit: async ({ setState, state }, nickname, email) => {
    await backend.registerExit(nickname, email);
    if (!email) await backend.selectExit(nickname);
    await getExits({ setState, state }, backend);
  },
  resetExit: async ({ setState, state }, nickname) => {
    await backend.resetExit(nickname);
    await getExits({ setState, state }, backend);
  },
  selectExit: async ({ setState, state }, nickname) => {
    await backend.selectExit(nickname);
    await getExits({ setState, state }, backend);
  },
  verifyExit: async ({ setState, state }, nickname, code) => {
    await backend.verifyExit(nickname, code);
    await backend.selectExit(nickname);
    await getExits({ setState, state }, backend);
  }
};
