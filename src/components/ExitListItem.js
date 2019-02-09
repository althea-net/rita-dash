import React from "react";
import { useTranslation } from "react-i18next";
import { ListGroupItem } from "reactstrap";
import { actions } from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usa from "../images/usa.svg";

const resetStyle = {
  color: "#999",
  cursor: "pointer",
  textDecoration: "underline"
};

export default ({ exit }) => {
  let [t] = useTranslation();

  if (!exit.exitSettings) return null;
  let { message, state } = exit.exitSettings;
  let { nickname } = exit;
  if (!message) message = "";

  return (
    <div>
      <ListGroupItem>
        <img src={usa} alt="USA" style={{ width: 80 }} />
        {nickname}
        {state !== "New" && (
          <span
            style={resetStyle}
            onClick={() => {
              actions.resetExit(nickname);
            }}
          >
            <FontAwesomeIcon
              icon="sync"
              color="#aaaaaa"
              style={{
                marginLeft: "15px",
                marginTop: "10px",
                marginRight: "5px"
              }}
            />
            {t("reset")}
          </span>
        )}
      </ListGroupItem>
    </div>
  );
};
