import React, { useState } from "react";
import { Button, Card, CardBody, Progress } from "reactstrap";
import { useTranslation } from "react-i18next";
import { Error } from "utils";
import ExitListItem from "./ExitListItem";
import ExitNodeSetup from "./ExitNodeSetup";
import { Provider } from "store/Exits";
import { get, post, useStore } from "store";
import useInterval from "hooks/useInterval";
const AbortController = window.AbortController;

const Exits = () => {
  const [t] = useTranslation();
  const [selectingExit, setSelectingExit] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [registering, setRegistering] = useState(false);

  const [{ exits, resetting, selectedExit }, dispatch] = useStore();

  const getExits = async signal => {
    if (!signal) {
      const controller = new AbortController();
      signal = controller.signal;
    }

    if (loading) return;
    setLoading(true);

    try {
      const blockchain = await get("/blockchain/get", true, 5000, signal);
      dispatch({ type: "blockchain", blockchain });

      let exits = await get("/exits", true, 5000, signal);
      if (exits.length) dispatch({ type: "exits", exits, resetting });

      setLoading(false);
      setInitialized(true);
    } catch {}
  };

  const resetExit = async exit => {
    const { nickname } = exit;
    dispatch({ type: "reset", nickname, resetting });
    await post(`/exits/${nickname}/reset`);
    getExits();
  };

  const selectExit = async nickname => {
    await post(`/exits/${nickname}/select`);
    getExits();
  };

  const registerExit = async (nickname, email, phone) => {
    try {
      await post(`/settings`, {
        exit_client: {
          reg_details: {
            email,
            phone
          }
        }
      });

      await post(`/exits/${nickname}/register`);
      if (!(email || phone)) await post(`/exits/${nickname}/select`);
      getExits();
    } catch {
      setRegistering(false);
      setError(t("registrationError"));
    }
  };

  const verifyExit = async (nickname, code) => {
    try {
      await post(`/exits/${nickname}/verify/${code}`);
      await post(`/exits/${nickname}/select`);
    } catch (e) {
      setRegistering(false);
      setError(t("verificationError"));
    }
    getExits();
  };

  useInterval(getExits, 5000);

  const store = {
    exits,
    getExits,
    error,
    setError,
    registering,
    setRegistering,
    registerExit,
    resetExit,
    selectExit,
    verifyExit
  };

  return (
    <Provider value={store}>
      <Card className="mb-4" id="exits">
        <CardBody>
          {selectingExit || <Error error={error} />}
          <h4>{t("exitNode")}</h4>
          {!initialized && loading ? (
            <Progress value={100} animated color="info" />
          ) : (
            <div>
              <p>{t("exitNodesP1")}</p>
              {selectedExit ? (
                <>
                  <ExitListItem
                    exit={selectedExit}
                    click={() => setSelectingExit(true)}
                  />
                  <Button
                    color="secondary"
                    style={{ width: 240 }}
                    onClick={() => setSelectingExit(true)}
                    id="exitNodeButton"
                  >
                    {t("updateExit")}
                  </Button>
                </>
              ) : (
                <div>
                  <p>{t("exitNodesP2")}</p>
                  <Button
                    color="primary"
                    style={{ width: 240 }}
                    onClick={() => setSelectingExit(true)}
                  >
                    {t("setupExitNode")}
                  </Button>
                </div>
              )}
              {selectingExit && (
                <ExitNodeSetup
                  open={selectingExit}
                  setOpen={setSelectingExit}
                />
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </Provider>
  );
};

export default Exits;
