import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "reactstrap";
import ExitsContext from "store/Exits";
import usa from "images/usa.svg";

export default ({ exit, setExit, setRegistering }) => {
  let [t] = useTranslation();
  let { resetExit } = useContext(ExitsContext);

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
    setExit(null);
  };

  return (
    <div>
      <h5 className="pl-4 pt-4 pb-2">{t("selectedExit")}</h5>
      <div className="d-flex pl-4">
        <img
          src={usa}
          alt="USA"
          style={{ width: 50, height: 50, marginRight: 20 }}
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
