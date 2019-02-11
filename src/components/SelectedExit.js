import React from "react";
import usa from "../images/usa.svg";

export default ({ exit }) => {
  if (!exit || !exit.exitSettings) return null;
  let { exitSettings, nickname } = exit;
  let { description } = exitSettings.generalDetails;
  nickname = "US West (Althea)";

  return (
    <div>
      <h5 className="pl-4 pt-4 pb-2">Selected Exit Node</h5>
      <div className="d-flex pl-4">
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
        </div>
      </div>
      <hr className="w-100" />
    </div>
  );
};
