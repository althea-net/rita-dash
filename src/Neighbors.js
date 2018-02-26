import React from "react";
import "./BasicScroll.css";
import {
  Table,
  Card,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle
} from "reactstrap";

const neighbors = [
  {
    name: "Cindy Barker",
    linkCost: 1,
    routeMetricToExit: Infinity,
    currentDebt: -12,
    totalDebt: 0
  },
  {
    name: "CascadianMesh Tower2",
    linkCost: 5,
    routeMetricToExit: 5,
    priceToExit: 12,
    currentDebt: 104,
    totalDebt: 0
  },
  {
    name: "Bobnet",
    linkCost: 0,
    routeMetricToExit: Infinity,
    currentDebt: -5,
    totalDebt: -230
  },
  {
    name: "Verizon",
    linkCost: 8,
    routeMetricToExit: Infinity,
    currentDebt: -30,
    totalDebt: 429
  },
  {
    name: "Donald J. Trump",
    linkCost: 7,
    routeMetricToExit: 5,
    priceToExit: 8,
    currentDebt: 234,
    totalDebt: 2
  },
  {
    name: "Franklin",
    linkCost: 4,
    routeMetricToExit: 6,
    priceToExit: 4,
    currentDebt: 0,
    totalDebt: 0
  },
  {
    name: "78oxoxox",
    linkCost: 5,
    routeMetricToExit: 10,
    priceToExit: 120,
    currentDebt: 0,
    totalDebt: 0
  },
  {
    name: "Jeff Knuckles",
    linkCost: 5,
    routeMetricToExit: 10,
    priceToExit: 1,
    currentDebt: 0,
    totalDebt: 0
  },
  {
    name: "flopington",
    linkCost: 2,
    routeMetricToExit: 4,
    priceToExit: 20,
    currentDebt: 0,
    totalDebt: 199
  },
  {
    name: "doonesbury",
    linkCost: 3,
    routeMetricToExit: 2,
    priceToExit: 5,
    currentDebt: 0,
    totalDebt: 2009
  }
];

function metric2word(metric) {
  if (metric < 3) {
    return "Excellent";
  }

  if (metric < 6) {
    return "Good";
  }

  if (metric < 10) {
    return "Poor";
  }

  return "None";
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
          background: `linear-gradient(90deg, #fff 0%, #fff ${dash}%, #000 ${dash}%, #000 ${100 -
            dash}%, #000 100%)`,
          backgroundSize: thickness * 2,
          animation,
          width: "100%"
        }}
      />
    </div>
  );
}

function NodeInfo({
  name,
  linkCost,
  routeMetricToExit,
  priceToExit,
  greatestCurrentDebt,
  currentDebt,
  totalDebt
}) {
  const absCurrentDebt = Math.abs(currentDebt);

  const normalizedCurrentDebt =
    Math.log(Math.abs(absCurrentDebt / greatestCurrentDebt * 10) + 1) /
    Math.log(11) *
    10;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 30
      }}
    >
      <h3 style={{ marginBottom: 0, marginRight: 10 }}>Me</h3>
      <ConnectionLine
        thickness={10}
        dash={(linkCost + 1) * 10}
        scrollDirection={currentDebt}
        scrollSpeed={(11 - normalizedCurrentDebt) * 10}
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
              <LabelUnit label="Link to me" content={metric2word(linkCost)} />
              <LabelUnit
                label="Link to internet"
                content={metric2word(routeMetricToExit)}
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
        thickness={10}
        dash={(routeMetricToExit + 1) * 10}
        scrollDirection={currentDebt}
        scrollSpeed={(11 - normalizedCurrentDebt) * 10}
      />
      <h3 style={{ marginBottom: 0, marginLeft: 10 }}>🌎</h3>
    </div>
  );
}

export default () => {
  const greatestCurrentDebt = neighbors.reduce((acc, neigh) => {
    if (Math.abs(neigh.currentDebt) > acc) {
      return Math.abs(neigh.currentDebt);
    } else {
      return acc;
    }
  }, 0);
  return (
    <div>
      <h1>Neighbors</h1>
      <div>
        {neighbors.map(neigh => (
          <NodeInfo greatestCurrentDebt={greatestCurrentDebt} {...neigh} />
        ))}
      </div>
    </div>
  );
};
