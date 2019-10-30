import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "reactstrap";
import ExitsContext from "store/Exits";
import greencheck from "images/greencheck.svg";
import { useStore } from "store";

export default ({ exit, setRegistering }) => {
  const [t] = useTranslation();
  const { resetExit } = useContext(ExitsContext);
  const [, dispatch] = useStore();

  if (!exit) return null;

  let {
    exitSettings: {
      generalDetails: { description } = { description: null },
      state,
      message
    },
    nickname
  } = exit;

  let reset = () => {
    exit.exitSettings.state = "GotInfo";
    setRegistering(false);
    resetExit(exit);
    dispatch({ type: "exit", exit: null });
  };

  return (
    <div>
      <h5 className="pl-4 pt-4 pb-2">{t("selectedExit")}</h5>
      <div className="d-flex pl-4">
        <img
          src={greencheck}
          alt="Green Checkmark"
          className="mr-2 mb-auto"
        />
        <div className="d-flex">
          <div>
            <h5 id="exitServerTitle">{nickname}</h5>
            <p className="mb-0">{description}</p>
            {state === "Denied" && (
              <>
                <p>{message}</p>
                <Button onClick={reset}>{t("reset")}</Button>
              </>
            )}
          </div>
        </div>
      </div>
      <hr className="w-100" />
    </div>
  );
};
