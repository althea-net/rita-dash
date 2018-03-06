//@flow

import React, { Component } from "react";
import "../styles/BasicScroll.css";
import { getNeighborData } from "../actions";
import { Card, CardBody, CardTitle } from "reactstrap";


export default class Neighbors extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fields: {}
    }
  }

  // normalizeNeighbors = this.normalizeNeighbors.bind(this)

  // componentDidMount() {
  //   this.normalizeNeighbors(this.props.store.neighborData);
  //   getNeighborData(this.props.store);
  // }

  // move to libs folder
  normalize(current, smallest, greatest) {
    return (current - smallest) / (greatest - smallest);
  }

  logNormalize(current, smallest, greatest) {
    if (current === Infinity || current === -Infinity) {
      return current;
    }
    return (
      Math.log(Math.abs(this.normalize(current, smallest, greatest) * 10) + 1) /
      Math.log(11)
    );
  }

  getGreatestAtKey(key, arr) {
    return arr.reduce((acc, item) => {
      if (Math.abs(item[key]) > acc) {
        return Math.abs(item[key]);
      } else {
        return acc;
      }
    }, -Infinity);
  }

  getSmallestAtKey(key, arr) {
    return arr.reduce((acc, item) => {
      if (Math.abs(item[key]) < acc) {
        return Math.abs(item[key]);
      } else {
        return acc;
      }
    }, Infinity);
  }

  normalizeNeighbors(neighbors) {
    const smallestCurrentDebt = this.getSmallestAtKey("currentDebt", neighbors);
    const greatestCurrentDebt = this.getGreatestAtKey("currentDebt", neighbors);

    const smallestRouteMetricToExit = this.getSmallestAtKey(
      "routeMetricToExit",
      neighbors
    );
    const greatestRouteMetricToExit = this.getGreatestAtKey(
      "routeMetricToExit",
      neighbors
    );

    const smallestLinkCost = this.getSmallestAtKey("linkCost", neighbors);
    const greatestLinkCost = this.getGreatestAtKey("linkCost", neighbors);

    const n = neighbors.map(neighbor => {
      return {
        ...neighbor,
        normalizedCurrentDebt: this.logNormalize(
          Math.abs(neighbor.currentDebt),
          smallestCurrentDebt,
          greatestCurrentDebt
        ),
        normalizedRouteMetricToExit: this.logNormalize(
          neighbor.routeMetricToExit,
          smallestRouteMetricToExit,
          greatestRouteMetricToExit
        ),
        normalizedLinkCost: this.logNormalize(
          neighbor.linkCost,
          smallestLinkCost,
          greatestLinkCost
        )
      };
    });

    this.setState({
      fields: this.props.store.state.neighborData
    });
  }

  render() {
    return (
      <div>
        <h1>Neighbors</h1>
        <div>
          {this.props.store.state.neighborData &&
            this.props.store.state.neighborData.map((neigh, i) => (
              <NodeInfo
                store={this.props.store}
                key={i}
                neighborData={neigh}
              />
            ))};
        </div>
      </div>
    );
  }
};

class NodeInfo extends React.Component {
  constructor(props) {
    super(props)
    // this.state = {
    //   fields: {}
    // }
  }

  metric2word(metric: number) {
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

  clamp(num, min, max) {
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

  render() {
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
          dash={this.clamp(normalizedLinkCost * 100, 4, 96)}
          scrollDirection={currentDebt}
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
                {name}
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
                  content={this.metric2word(normalizedLinkCost)}
                />
                <LabelUnit
                  label="Link to internet"
                  content={this.metric2word(normalizedRouteMetricToExit)}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap"
                }}
              >
                {currentDebt < 0 ? (
                  <LabelUnit
                    label="They are paying me"
                    content={`${-currentDebt} ¢/sec.`}
                  />
                ) : (
                    <LabelUnit
                      label="I am paying them"
                      content={`${currentDebt} ¢/sec.`}
                    />
                  )}
                {routeMetricToExit < 10 && (
                  <LabelUnit
                    label="Bandwidth price"
                    content={`${priceToExit} ¢/gb`}
                  />
                )}
                {totalDebt < 0 ? (
                  <LabelUnit label="Total earned" content={`$${-totalDebt}`} />
                ) : (
                    <LabelUnit label="Total paid" content={`$${totalDebt}`} />
                  )}
              </div>
            </CardBody>
          </Card>
        </div>
        <ConnectionLine
          thickness={!(currentDebt < 0) ? 10 : 0}
          dash={this.clamp(normalizedRouteMetricToExit * 100, 4, 96)}
          scrollDirection={currentDebt}
          scrollSpeed={(1.1 - normalizedCurrentDebt) * 30}
        />
        <h3 style={{ marginBottom: 0, marginLeft: 10 }}>🌎</h3>
      </div >
    );
  }
}


class ConnectionLine extends Component {
  render() {
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
}

class LabelUnit extends React.Component {
  render() {
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
  }
}