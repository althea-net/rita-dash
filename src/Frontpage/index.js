import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { actions, Context } from "store";

import Finances from "./Finances";
import NodeInformation from "./NodeInformation";

const Frontpage = () => {
  let [t] = useTranslation();
  let {
    state: {
      info: { ritaVersion, version }
    }
  } = useContext(Context);

  useEffect(() => {
    actions.getSettings();
  }, []);

  return (
    <>
      <h1 id="frontPage">{t("welcome")}</h1>
      <p id="version">{t("version", { version, ritaVersion })}</p>
      <Finances />
      <NodeInformation />
    </>
  );
};

export default Frontpage;
