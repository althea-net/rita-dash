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
              {routeMetricToExit < 10 && (
                <LabelUnit
                  label="Bandwidth price"
                  content={`${priceToExit} ¢/gb`}
                />
              )}
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
      {neighbors.map(neigh => (
        <NodeInfo greatestCurrentDebt={greatestCurrentDebt} {...neigh} />
      ))}
    </div>
  );
};

// The poor man's D3
const layouts = {
  1: [
    { x: 50, y: 50 },
    { x: 94, y: 10 } // 1
  ],
  2: [
    { x: 50, y: 50 },
    { x: 94, y: 10 }, // 1
    { x: 13, y: 5 } // 2
  ],
  3: [
    { x: 50, y: 50 },
    { x: 94, y: 10 }, // 1
    { x: 13, y: 5 }, // 2
    { x: 45, y: 99 } // 3
  ],
  4: [
    { x: 50, y: 50 },
    { x: 94, y: 0 }, // 1
    { x: 13, y: 0 }, // 2
    { x: 85, y: 99 }, // 3
    { x: 8, y: 98 } // 4
  ],
  5: [
    { x: 50, y: 50 },
    { x: 100, y: 38 }, // 1
    { x: 55, y: 0 }, // 2
    { x: 95, y: 100 }, // 3
    { x: 8, y: 98 }, // 4
    { x: 3, y: 25 } // 5
  ],
  6: [
    { x: 50, y: 50 },
    { x: 94, y: 38 }, // 1
    { x: 63, y: 5 }, // 2
    { x: 93, y: 91 }, // 3
    { x: 30, y: 98 }, // 4
    { x: 10, y: 5 }, // 5
    { x: 0, y: 59 } // 6
  ],
  7: [
    { x: 50, y: 50 },
    { x: 94, y: 38 }, // 1
    { x: 63, y: 5 }, // 2
    { x: 93, y: 81 }, // 3
    { x: 50, y: 98 }, // 4
    { x: 10, y: 5 }, // 5
    { x: 0, y: 50 }, // 6
    { x: 0, y: 98 } // 7
  ],
  8: [
    { x: 50, y: 50 },
    { x: 94, y: 8 }, // 1
    { x: 48, y: 5 }, // 2
    { x: 89, y: 51 }, // 3
    { x: 89, y: 89 }, // 4
    { x: 10, y: 10 }, // 5
    { x: 0, y: 50 }, // 6
    { x: 0, y: 98 }, // 7
    { x: 50, y: 100 } // 8
  ],
  9: [
    { x: 50, y: 50 },
    { x: 100, y: 18 }, // 1
    { x: 68, y: 5 }, // 2
    { x: 89, y: 51 }, // 3
    { x: 89, y: 89 }, // 4
    { x: 30, y: 1 }, // 5
    { x: 3, y: 20 }, // 6
    { x: 0, y: 60 }, // 7
    { x: 50, y: 100 }, // 8
    { x: 10, y: 94 } // 9
  ],
  10: [
    { x: 50, y: 50 },
    { x: 100, y: 0 }, // 1
    { x: 68, y: 5 }, // 2
    { x: 94, y: 40 }, // 3
    { x: 99, y: 75 }, // 4
    { x: 40, y: 3 }, // 5
    { x: 0, y: 14 }, // 6
    { x: 0, y: 55 }, // 7
    { x: 75, y: 100 }, // 8
    { x: 41, y: 94 }, // 9
    { x: 4, y: 95 } // 10
  ]
};

function neigh2Graph(neighbors) {
  const layout = layouts[neighbors.length];
  const graph = {
    nodes: [
      {
        label: "Me",
        size: 150,
        x: layout[0].x,
        y: layout[0].y
      }
    ],
    edges: []
  };

  neighbors.forEach((neigh, i) => {
    graph.nodes.push({
      label: neigh.name,
      size: 150,
      x: layout[i + 1].x,
      y: layout[i + 1].y
    });
    graph.edges.push({
      start: 0,
      end: i + 1,
      weight: 10 - neigh.linkCost
    });
  });

  return graph;
}

function makeRect(x1, y1, x2, y2) {
  return {
    length: Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)),
    angle: Math.atan2(y1 - y2, x1 - x2)
  };
}

function Graph() {
  const graph = neigh2Graph(neighbors);
  return (
    <div style={{ padding: 50, maxWidth: 500 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "100%"
        }}
      >
        {graph.edges.map((edge, i) => {
          const start = graph.nodes[edge.start];
          const end = graph.nodes[edge.end];
          const { length, angle } = makeRect(end.x, end.y, start.x, start.y);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: `${length}%`,
                top: `${start.y}%`,
                left: `${start.x}%`,
                height: edge.weight,
                background: "#000",
                transform: `rotate(${angle}rad)`,
                transformOrigin: "top left"
              }}
            />
          );
        })}
        {graph.nodes.map((node, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: node.size,
              height: node.size,
              marginTop: `-${node.size / 2}px`,
              marginLeft: `-${node.size / 2}px`,
              borderRadius: "100%",
              border: "3px solid black",
              left: `${node.x}%`,
              top: `${node.y}%`,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div style={{ textAlign: "center", color: "red" }}>
              {node.label} <br /> 20934
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
