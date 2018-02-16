import React from "react";
import { Sigma, RandomizeNodePositions, RelativeSize } from "react-sigma";
import ForceLink from "react-sigma/lib/ForceLink";
import NodeShapes from "react-sigma/lib/NodeShapes";
import EdgeShapes from "react-sigma/lib/EdgeShapes";
import NOverlap from "react-sigma/lib/NOverlap";

const neighbors = [
  { name: "1", linkCost: 23 },
  { name: "2", linkCost: 23 },
  { name: "3", linkCost: 23 },
  { name: "4", linkCost: 23 },
  { name: "5", linkCost: 23 },
  { name: "6", linkCost: 23 },
  { name: "7", linkCost: 23 },
  { name: "8", linkCost: 23 },
  { name: "9", linkCost: 23 },
  { name: "10", linkCost: 23 }
];

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
    { x: 94, y: 10 }, // 1
    { x: 13, y: 5 }, // 2
    { x: 85, y: 99 }, // 3
    { x: 8, y: 98 } // 4
  ],
  5: [
    { x: 50, y: 50 },
    { x: 94, y: 38 }, // 1
    { x: 63, y: 5 }, // 2
    { x: 75, y: 91 }, // 3
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
    { x: 89, y: 34 }, // 3
    { x: 99, y: 70 }, // 4
    { x: 40, y: 13 }, // 5
    { x: 8, y: 10 }, // 6
    { x: 0, y: 45 }, // 7
    { x: 80, y: 100 }, // 8
    { x: 50, y: 94 }, // 9
    { x: 14, y: 89 } // 10
  ]
};

function neigh2Graph(neighbors) {
  const layout = layouts[neighbors.length];
  const graph = {
    nodes: [
      {
        label: "Me",
        size: 100,
        x: layout[0].x,
        y: layout[0].y
      }
    ],
    edges: []
  };

  neighbors.forEach((neigh, i) => {
    graph.nodes.push({
      label: neigh.name,
      size: 100,
      x: layout[i + 1].x,
      y: layout[i + 1].y
    });
    graph.edges.push({
      start: 0,
      end: i + 1
    });
  });

  return graph;
}

function makeSquare(x1, y1, x2, y2) {
  return {
    length: Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)),
    angle: Math.atan2(y1 - y2, x1 - x2)
  };
}

export default () => {
  const graph = neigh2Graph(neighbors);
  return (
    <div style={{ padding: 50, maxWidth: 500, background: "#fafafa" }}>
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
          const { length, angle } = makeSquare(end.x, end.y, start.x, start.y);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: `${length}%`,
                top: `${start.y}%`,
                left: `${start.x}%`,
                height: 3,
                background: "blue",
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
};
