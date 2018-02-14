import React from "react";
import { Button } from "reactstrap";

export default () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        maxWidth: 750
      }}
    >
      <Icon>Buy Coins</Icon>
      <Icon>Wifi Settings</Icon>
      <Icon>Payments</Icon>
      <Icon>Neighbors</Icon>
    </div>
  </div>
);

function Icon(props) {
  return (
    <div style={{ padding: 50, paddingBottom: 0 }}>
      <div
        style={{
          width: 200,
          height: 200,
          background: "blue"
        }}
      />
      <h2>{props.children}</h2>
    </div>
  );
}
