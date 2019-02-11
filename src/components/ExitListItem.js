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

const Status = styled.span`
  color: #27d38d;
  margin-left: 5px;
`;

export default ({ exit, setExit }) => {
  if (!exit.exitSettings) return null;
  let { exitSettings, nickname } = exit;
  let { description } = exitSettings.generalDetails;
  nickname = "US West (Althea)";

  return (
    <Item className="d-flex" onClick={() => setExit(exit)}>
      <Flag src={usa} alt="USA" />
      <div className="d-flex">
        <div>
          <h5>{nickname}</h5>
          <p className="mb-0">{description}</p>
        </div>
        <div className="ml-2">
          <FontAwesomeIcon color="#27D38D" icon="check-circle" />
          <Status>Great connection</Status>
        </div>
      </div>
    </Item>
  );
};
