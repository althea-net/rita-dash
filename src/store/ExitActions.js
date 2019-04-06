import { getBlockchain } from "./PaymentActions";
import { get, post } from "./fetch";

export const getExits = async ({ setState, state }) => {
  let { blockchain, resetting, loadingExits } = state;

  if (loadingExits) return;
  setState({ exitsError: false, initializing: false, loadingExits: true });

  if (!blockchain)
    blockchain = (await getBlockchain({ setState, state })).blockchain;

  let exits = [];
  exits = await get("/exits", true, 500000);

  if (exits instanceof Error) {
    return setState({
      exitsError: state.t("exitsError"),
      exits: null,
      initializing: false,
      loadingExits: false
    });
  }

  const sort = (a, b) => {
    a.nickname.localeCompare(b.nickname, undefined, {
      sensitivity: "base"
    });
  };

  if (exits.length)
    exits = exits
      .filter(exit => {
        return (
          (exit.exitSettings.generalDetails &&
            exit.exitSettings.generalDetails.exitCurrency === blockchain) ||
          exit.exitSettings.state === "Denied"
        );
      })
      .sort(sort);

  resetting = resetting.filter(
    nick =>
      exits
        .filter(e => e.exitSettings.state !== "New")
        .findIndex(e => e.nickname === e.nick) > -1
  );

  setState({
    exitsError: null,
    exits,
    initializing: false,
    loadingExits: false,
    resetting
  });
};

const registerExit = async (nickname, email, phone) => {
  await post(`/settings`, {
    exit_client: {
      reg_details: {
        email,
        phone
      }
    }
  });

  return post(`/exits/${nickname}/register`);
};

export default {
  getExits: async ({ setState, state }) => {
    getExits({ setState, state });
  },
  registerExit: async ({ setState, state }, nickname, email, phone) => {
    await registerExit(nickname, email, phone);
    if (!(email || phone)) await post(`/exits/${nickname}/select`);
    await getExits({ setState, state });
  },
  resetExit: async ({ setState, state }, exit) => {
    let { resetting } = state;
    let { exitSettings, nickname } = exit;
    if (exitSettings.state === "Pending") resetting.push(nickname);
    await post(`/exits/${nickname}/reset`);
    await getExits({ setState, state });
    return { resetting };
  },
  selectExit: async ({ setState, state }, nickname) => {
    await post(`/exits/${nickname}/select`);
    await getExits({ setState, state });
  },
  verifyExit: async ({ setState, state }, nickname, code) => {
    await post(`/exits/${nickname}/verify/${code}`);
    await post(`/exits/${nickname}/select`);
    await getExits({ setState, state });
  }
};
