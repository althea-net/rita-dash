import React from "react";

export default () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap"
    }}
  >
    <Icon image="/payments.svg" link="#payments">
      Payments
    </Icon>
    <Icon image="/neighbors.svg" link="#neighbors">
      Neighbors
    </Icon>
    <Icon image="/network.svg" link="#wifi-settings">
      Network Settings
    </Icon>
    <Icon image="/router.svg" link="#wifi-settings">
      Router Settings
    </Icon>
  </div>
);

function Icon({ children, link, image }) {
  return (
    <div style={{ padding: 50, paddingBottom: 0 }}>
      <a href={link}>
        <img width={256} height={256} src={image} />
        <h2>{children}</h2>
      </a>
    </div>
  );
}
