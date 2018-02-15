import React from "react";
import { Button } from "reactstrap";

export default () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap"
    }}
  >
    <Icon link="#wifi-settings">Wifi Settings</Icon>
    <Icon link="#payments">Payments</Icon>
    <Icon link="#neighbors">Neighbors</Icon>
  </div>
);

function Icon({ children, link }) {
  return (
    <div style={{ padding: 50, paddingBottom: 0 }}>
      <a href={link}>
        <div
          style={{
            width: 200,
            height: 200,
            background: "blue"
          }}
        />
        <h2>{children}</h2>
      </a>
    </div>
  );
}
