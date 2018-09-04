import React, { Component } from "react";
import "../styles/BasicScroll.css";

import { Card, CardBody, CardTitle, Progress } from "reactstrap";

import { actions, connect } from "../store";
import Error from "./Error";

class Neighbors extends Component {
  componentDidMount() {
    actions.getNeighbors();
  }

  render() {
    const { loading, neighbors, neighborsError } = this.props.state;
    const normNeighbors = normalizeNeighbors(neighbors);
    const exits = normNeighbors.filter(n => n.isExit);
    const peers = normNeighbors.filter(n => !n.isExit);

    return (
      <div>
        <h1>Neighbors</h1>
        <Error error={neighborsError} />
        {loading && <Progress animated color="info" value="100" />}
        {peers.length > 0 && (
          <Card style={{ padding: 10 }}>
            <h2>Mesh Peers</h2>
            {peers.map(n => (
              <NodeInfo {...n} key={n.nickname} />
            ))}
          </Card>
        )}
        {exits.length > 0 && (
          <Card style={{ padding: 10, marginTop: 10 }}>
            <h2>Exits</h2>
            {exits.map(n => (
              <NodeInfo {...n} key={n.nickname} />
            ))}
          </Card>
        )}
      </div>
    );
  }
}

function metric2word(metric) {
  if (metric > 1) {
    return "None";
  }

  if (metric > 0.75) {
    return "●○○○";
  }

  if (metric > 0.5) {
    return "●●○○";
  }

  if (metric > 0.25) {
    if (metric > 3) {
      return "●●●○";
    }
  }

  return "●●●●";
}

function LabelUnit({ label, content, marginBottom, marginRight }) {
  return (
    <div
      style={{
        lineHeight: "100%",
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 10
      }}
    >
      <small>{label}:</small>
      <br />
      <b>{content}</b>
    </div>
  );
}

function ConnectionLine({
  label,
  thickness,
  children,
  dash,
  scrollDirection,
  scrollSpeed
}) {
  let animation;
  if (scrollDirection && scrollSpeed) {
    if (scrollDirection > 0) {
      animation = `ScrollLeft ${scrollSpeed}s linear infinite`;
    } else {
      animation = `ScrollRight ${scrollSpeed}s linear infinite`;
    }
  } else {
    animation = "none";
  }
  return (
    <div
      style={{
        minWidth: 30,
        flexGrow: 1,
        display: "flex",
        position: "relative",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
      }}
    >
      <div
        style={{
          height: thickness,
          background: `linear-gradient(90deg, #fff 0%, #fff ${dash}%, #000 ${dash}%, #000 100%)`,
          backgroundSize: thickness * 2,
          animation,
          width: "100%"
        }}
      />
    </div>
  );
}

function normalize(current, smallest, greatest) {
  return greatest && (current - smallest) / (greatest - smallest);
}

function logNormalize(current, smallest, greatest) {
  if (current === Infinity || current === -Infinity) {
    return current;
  }
  return (
    Math.log(Math.abs(normalize(current, smallest, greatest) * 10) + 1) /
    Math.log(11)
  );
}

function getGreatestAtKey(key, arr) {
  return arr.reduce((acc, item) => {
    if (Math.abs(item[key]) > acc) {
      return Math.abs(item[key]);
    } else {
      return acc;
    }
  }, -Infinity);
}

function getSmallestAtKey(key, arr) {
  return arr.reduce((acc, item) => {
    if (Math.abs(item[key]) < acc) {
      return Math.abs(item[key]);
    } else {
      return acc;
    }
  }, Infinity);
}

function clamp(num, min, max) {
  if (num === Infinity || num === -Infinity) {
    return num;
  }

  if (num < min) {
    return min;
  }

  if (num > max) {
    return max;
  }

  return num;
}

function normalizeNeighbors(neighbors) {
  const greatestCurrentDebt = getGreatestAtKey("debt", neighbors);
  const smallestCurrentDebt = getSmallestAtKey("debt", neighbors);

  const smallestRouteMetricToExit = getSmallestAtKey(
    "routeMetricToExit",
    neighbors
  );
  const greatestRouteMetricToExit = getGreatestAtKey(
    "routeMetricToExit",
    neighbors
  );

  const smallestLinkCost = getSmallestAtKey("linkCost", neighbors);
  const greatestLinkCost = getGreatestAtKey("linkCost", neighbors);

  const n = neighbors.map(neighbor => {
    return {
      ...neighbor,
      normalizedCurrentDebt: logNormalize(
        Math.abs(neighbor.debt),
        smallestCurrentDebt,
        greatestCurrentDebt
      ),
      normalizedRouteMetricToExit: logNormalize(
        neighbor.routeMetricToExit,
        smallestRouteMetricToExit,
        greatestRouteMetricToExit
      ),
      normalizedLinkCost: logNormalize(
        neighbor.linkCost,
        smallestLinkCost,
        greatestLinkCost
      )
    };
  });

  return n;
}

function NodeInfo({
  nickname,

  linkCost,
  normalizedLinkCost,

  routeMetricToExit,
  normalizedRouteMetricToExit,

  priceToExit,

  normalizedCurrentDebt,

  totalPaymentSent,
  totalPaymentReceived,
  debt,
  incomingPayments
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 30
      }}
    >
      <h3 style={{ marginBottom: 0, marginRight: 10 }}>Me</h3>
      {/* linkCost: {linkCost} normalizedLinkCost: {normalizedLinkCost} */}
      <ConnectionLine
        thickness={10}
        dash={clamp(normalizedLinkCost * 100, 4, 96)}
        scrollDirection={debt}
        scrollSpeed={(1.1 - normalizedCurrentDebt) * 30}
      />
      <div>
        <Card
          style={{
            border: "3px solid black"
          }}
        >
          <CardBody
            style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 15 }}
          >
            <CardTitle style={{ marginLeft: 10, marginRight: 10 }}>
              {nickname}
            </CardTitle>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap"
              }}
            >
              <LabelUnit
                label="Link to me"
                content={metric2word(normalizedLinkCost)}
              />
              <LabelUnit
                label="Link to internet"
                content={metric2word(normalizedRouteMetricToExit)}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap"
              }}
            >
              {(debt < 0 && (
                <LabelUnit
                  label="They are paying me"
                  content={`${-debt} ¢/sec.`}
                />
              )) ||
                (debt > 0 && (
                  <LabelUnit
                    label="I am paying them"
                    content={`${debt} ¢/sec.`}
                  />
                ))}
              {routeMetricToExit < 10 && (
                <LabelUnit
                  label="Bandwidth price"
                  content={`${priceToExit} ¢/gb`}
                />
              )}
              {(totalPaymentReceived > 0 && (
                <LabelUnit
                  label="Total earned"
                  content={`♦ ${totalPaymentReceived}`}
                />
              )) ||
                (totalPaymentSent > 0 && (
                  <LabelUnit
                    label="Total paid"
                    content={`♦ ${totalPaymentSent}`}
                  />
                ))}
            </div>
          </CardBody>
        </Card>
      </div>
      <ConnectionLine
        thickness={!(debt < 0) ? 10 : 0}
        dash={clamp(normalizedRouteMetricToExit * 100, 4, 96)}
        scrollDirection={debt}
        scrollSpeed={(1.1 - normalizedCurrentDebt) * 30}
      />
      <h3 style={{ marginBottom: 0, marginLeft: 10 }}>
        <span role="img" aria-label="Globe">
          🌎
        </span>
      </h3>
    </div>
  );
}

export default connect(["loading", "neighbors", "neighborsError"])(Neighbors);
