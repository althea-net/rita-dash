import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { post, useStore } from "store";
import { RightCard } from "ui";

const ResetExit = () => {
  const [t] = useTranslation();

  const [{ resetting, selectedExit }, dispatch] = useStore();

  const resetExit = async (exit) => {
    const { nickname } = exit;
    dispatch({ type: "reset", nickname, resetting });
    await post(`/exits/${nickname}/reset`);
  };

  return (
    <RightCard>
      <h4>{t("resetExit")}</h4>
      <p>{t("resetExitBlurb")}</p>
      <Button
        color="primary"
        outline
        onClick={() => resetExit(selectedExit)}
        className="mb-0 mb-sm-0 w-100"
        id="exitNodeButton"
      >
        <FontAwesomeIcon icon="sync" className="mr-2" />
        {t("resetConnection")}
      </Button>
    </RightCard>
  );
};

export default ResetExit;
