import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Account from "./Account";

export default () => {
  return (
    <div style={{ marginBottom: 40 }}>
      <div className="w-100 d-flex justify-content-between">
        <h2>Finances</h2>
        <div className="my-auto">
          <a href="#payments">
            Manage Payment Settings
            <FontAwesomeIcon
              size="lg"
              icon="angle-right"
              style={{ marginLeft: 10 }}
            />
          </a>
        </div>
      </div>
      <Account balance={0.452} />
    </div>
  );
};
