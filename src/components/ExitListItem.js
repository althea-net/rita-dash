import React from "react";
import { ListGroupItem } from "reactstrap";
import usa from "../images/usa.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default ({ exit }) => {
  if (!exit.exitSettings) return null;
  let { exitSettings, nickname } = exit;
  let { description } = exitSettings.generalDetails;
  nickname = "US West (Althea)";

  return (
    <div>
      <ListGroupItem
        className="d-flex"
        style={{ borderRadius: 0, marginBottom: 10 }}
      >
        <img
          src={usa}
          alt="USA"
          style={{ width: 50, height: 50, marginRight: 20 }}
        />
        <div className="d-flex">
          <div>
            <h5>{nickname}</h5>
            <p className="mb-0">{description}</p>
          </div>
          <div className="ml-2">
            <FontAwesomeIcon color="#27D38D" icon="check-circle" />
            <span style={{ color: "#27d38d", marginLeft: 5 }}>
              Great connection
            </span>
          </div>
        </div>
      </ListGroupItem>
    </div>
  );
};
