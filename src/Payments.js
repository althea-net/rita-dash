import React from "react";
import { Button, Progress } from "reactstrap";

export default () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column"
    }}
  >
    <MoneyBar avgUse={100} currentFunds={50} />
    <br />
    <MoneyBar avgUse={50} currentFunds={100} />
    <br />
    <MoneyBar avgUse={100} currentFunds={10} />
  </div>
);

function MoneyBar({ avgUse, currentFunds }) {
  let currentFundsPos, avgUsePos;
  const scaling = 85;
  if (currentFunds < avgUse) {
    currentFundsPos = currentFunds / avgUse * scaling;
    avgUsePos = scaling;
  } else {
    avgUsePos = avgUse / currentFunds * scaling;
    currentFundsPos = scaling;
  }

  let color;
  if (currentFunds > 25) {
    color = "success";
  } else if (currentFunds > 10) {
    color = "warning";
  } else {
    color = "danger";
  }

  return (
    <div>
      <PercentSpacer
        progress={currentFundsPos}
        pointer="↓"
        pointerAlign="bottom"
      >
        Current funds: ${currentFunds}
      </PercentSpacer>
      <Progress striped color={color} value={currentFundsPos} />
      <PercentSpacer progress={avgUsePos} pointer="↑">
        Average monthly use: ${avgUse}
      </PercentSpacer>
    </div>
  );
}

function PercentSpacer({ children, progress, pointer, pointerAlign }) {
  if (progress < 50) {
    return (
      <div style={{ textAlign: "left", display: "flex" }}>
        <div
          style={{
            width: `${progress}%`,
            marginLeft: ".5em",
            textAlign: "right"
          }}
        >
          {pointer}
        </div>
        <div
          style={{
            width: `${100 - progress}%`,
            textAlign: "left"
          }}
        >
          {children}
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ textAlign: "right", display: "flex" }}>
        <div
          style={{
            width: `${progress}%`,
            textAlign: "right",
            display: "inline-block"
          }}
        >
          {children}
        </div>
        <div
          style={{
            width: `${100 - progress}%`,
            marginRight: ".7em",
            textAlign: "left"
          }}
        >
          {pointer}
        </div>
      </div>
    );
  }
}
