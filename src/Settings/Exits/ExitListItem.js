import React from "react";
import { useTranslation } from "react-i18next";
import { ListGroupItem } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const Item = styled(ListGroupItem)`
  border-radius: 0 !important;
  margin-bottom: 10px !important;
  cursor: pointer;

  &:hover {
    background: #eaf6fe;
    border-color: #3fabf4;
    outline: 1px solid #3fabf4;
  }
`;

export default ({ exit, click }) => {
  const [t] = useTranslation();
  if (!exit.exitSettings) return null;
  let {
    exitSettings: { description, state },
    nickname,
    isSelected,
    isReachable,
    haveRoute
  } = exit;

  let connected = isReachable && haveRoute;
  let pseudostate = state;

  if (!connected) pseudostate = "Problem";

  return (
    <Item
      className="d-flex flex-wrap w-100"
      onClick={click}
      id={nickname + "_Banner"}
    >
      <div className="d-flex flex-grow-1">
        <div className="mb-2">
          <h5 id="exitServerTitle" className="mb-1">
            {nickname}
          </h5>
          <p
            className="mb-0"
            style={{ wordBreak: "break-none", whiteSpace: "no-wrap" }}
          >
            {description}
          </p>
        </div>
      </div>
      {pseudostate === "Problem" ? (
        <div className="ml-sm-auto text-sm-right">
          <FontAwesomeIcon color="red" icon="exclamation-triangle" />
          <span style={{ marginLeft: 5, color: "red" }}>
            {t("connectionProblem")}
          </span>
        </div>
      ) : (
        <div className="ml-auto text-right">
          <FontAwesomeIcon color="#27D38D" icon="check-circle" />
          <span style={{ marginLeft: 5, color: "#27d38d" }}>
            {t("greatConnection")}
          </span>
        </div>
      )}
    </Item>
  );
};
