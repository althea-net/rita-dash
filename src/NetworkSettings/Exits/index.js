import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Progress } from "reactstrap";
import { useTranslation } from "react-i18next";
import { Error } from "utils";
import ExitListItem from "./ExitListItem";
import ExitNodeSetup from "./ExitNodeSetup";
import { Provider } from "store/Exits";
import { get, post } from "store";
import useInterval from "utils/UseInterval";

const Exits = () => {
  const [t] = useTranslation();
  const [selectingExit, setSelectingExit] = useState(false);
  const [exits, setExits] = useState([]);
  const [exitsError, setExitsError] = useState(null);
  const [loadingExits, setLoadingExits] = useState(false);
  const [resetting, setResetting] = useState([]);
  const [initialized, setInitialized] = useState(false);

  const getExits = async signal => {
    if (loadingExits) return;
    setLoadingExits(true);

    try {
      const blockchain = await get("/blockchain/get/", true, 5000);

      let exits = [];
      exits = await get("/exits", true, 5000);

      if (exits instanceof Error) setExitsError(t("exitsError"));

      const sort = (a, b) => {
        a.nickname.localeCompare(b.nickname, undefined, {
          sensitivity: "base"
        });
      };

      if (exits.length) {
        exits = exits
          .filter(exit => {
            return (
              (exit.exitSettings.generalDetails &&
                exit.exitSettings.generalDetails.exitCurrency === blockchain) ||
              exit.exitSettings.state === "Denied"
            );
          })
          .sort(sort);

        setExits(exits);

        exits
          .filter(
            e =>
              e.exitSettings.state === "Pending" ||
              e.exitSettings.state === "GotInfo"
          )
          .map(e => resetting.includes(e.nickname) && setResetting([]));
      }

      setLoadingExits(false);
    } catch (e) {}
  };

  const resetExit = async exit => {
    let { exitSettings, nickname } = exit;
    let r = resetting;
    if (exitSettings.state === "Pending" || exitSettings.state === "Denied") {
      r.push(exit.nickname);
      setResetting(r);
    }
    await post(`/exits/${nickname}/reset`);
    getExits();
  };

  const selectExit = async nickname => {
    await post(`/exits/${nickname}/select`);
    getExits();
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

    await post(`/exits/${nickname}/register`);
    if (!(email || phone)) await post(`/exits/${nickname}/select`);
    getExits();
  };

  const verifyExit = async (nickname, code) => {
    try {
      await post(`/exits/${nickname}/verify/${code}`);
      await post(`/exits/${nickname}/select`);
    } catch (e) {
      setExitsError("There was a problem submitting the code");
    }
    getExits();
  };

  const init = async () => {
    await getExits();
    setInitialized(true);
  };

  useEffect(() => {
    init();
    return;
  }, []);
  useInterval(getExits, 5000);

  let selected = exits.find(exit => {
    let { state } = exit.exitSettings;
    return exit.isSelected && state === "Registered";
  });

  const store = {
    exits,
    getExits,
    setExits,
    exitsError,
    setExitsError,
    loadingExits,
    setLoadingExits,
    registerExit,
    resetExit,
    resetting,
    selectExit,
    setResetting,
    verifyExit
  };

  return (
    <Provider value={store}>
      <Card className="mb-2">
        <CardBody>
          <Error error={exitsError} />
          <h2>{t("exitNode")}</h2>
          {!initialized && loadingExits ? (
            <Progress value={100} animated color="info" />
          ) : (
            <div>
              <p>{t("exitNodesP1")}</p>
              {selected ? (
                <>
                  <ExitListItem
                    exit={selected}
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
