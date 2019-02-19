import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Context } from "../store";
import { Progress } from "reactstrap";

import Error from "./Error";
import Finances from "./Finances";
import UsageMetrics from "./UsageMetrics";
import NetworkConnection from "./NetworkConnection";
import NodeInformation from "./NodeInformation";

const Frontpage = () => {
  let [t] = useTranslation();
  let {
    state: {
      error,
      info: { ritaVersion, version },
      loading
    }
  } = useContext(Context);

  return (
    <>
      <h1>{t("welcome")}</h1>

      {error ? (
        <Error error={error} />
      ) : loading ? (
        <Progress animated color="info" value="100" />
      ) : (
        <div>
          <p>{t("version", { version, ritaVersion })}</p>

          <Finances />
          <UsageMetrics />
          <NetworkConnection />
          <NodeInformation />
        </div>
      )}
    </>
  );
};

export default Frontpage;
