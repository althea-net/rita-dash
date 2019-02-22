import React from "react";
import { ListGroupItem } from "reactstrap";
import usa from "../images/usa.svg";
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

const Flag = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 20px;
`;

export default ({ exit, click }) => {
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

  if (state === "Registered" && isSelected) {
    connected = exit.isTunnelWorking;
    pseudostate = connected && "Connected";
  }

  if (!connected) pseudostate = "Problem";

  return (
    <Item className="d-flex" onClick={click}>
      <Flag src={usa} alt="USA" />
      <div className="d-flex">
        <div>
          <h5>{nickname}</h5>
          <p className="mb-0">{description}</p>
        </div>
        {pseudostate === "Problem" ? (
          <div className="ml-2">
            <FontAwesomeIcon color="red" icon="exclamation-triangle" />
            <span style={{ marginLeft: 5, color: "red" }}>
              Connection problem
            </span>
          </div>
        ) : (
          <div className="ml-2">
            <FontAwesomeIcon color="#27D38D" icon="check-circle" />
            <span style={{ marginLeft: 5, color: "#27d38d" }}>
              Great connection
            </span>
          </div>
        )}
      </div>
    </Item>
  );
};
