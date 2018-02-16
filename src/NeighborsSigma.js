import React from "react";
import { Sigma, RandomizeNodePositions, RelativeSize } from "react-sigma";
import ForceLink from "react-sigma/lib/ForceLink";
import NodeShapes from "react-sigma/lib/NodeShapes";
import EdgeShapes from "react-sigma/lib/EdgeShapes";
import NOverlap from "react-sigma/lib/NOverlap";

let myGraph = {
  nodes: [
    {
      id: "n1",
      label: "Me",
      size: 100
    },
    { id: "n2", label: "Rabbit Latency", size: 20 },
    { id: "n3", label: "Rabbit", size: 20 },
    { id: "n4", label: "Rabbit", size: 20 },
    { id: "n5", label: "Rabbit", size: 20 },
    { id: "n6", label: "Rabbit", size: 20 },
    { id: "n7", label: "Rabbit", size: 20 }
  ],
  edges: [
    {
      id: "e1",
      source: "n1",
      target: "n2",
      label: "SEES",
      color: "#f00",
      size: 1
    },
    { id: "e2", source: "n1", target: "n3", label: "SEES", size: 2 },
    { id: "e3", source: "n1", target: "n4", label: "SEES", size: 3 },
    { id: "e4", source: "n1", target: "n5", label: "SEES", size: 4 },
    { id: "e5", source: "n1", target: "n6", label: "SEES", size: 5 },
    { id: "e6", source: "n1", target: "n7", label: "SEES", size: 6 }
  ]
};

export default () => (
  <Sigma
    graph={myGraph}
    settings={{
      mouseEnabled: false,
      touchEnabled: false,
      minNodeSize: 20,
      maxNodeSize: 40,
      minEdgeSize: 1,
      maxEdgeSize: 10,
      //   drawEdgeLabels: true,
      //   drawEdges: true,
      clone: false,
      sideMargin: 20,
      defaultNodeColor: "#ccc"
    }}
    renderer="canvas"
  >
    {/* <RelativeSize initialSize={10} /> */}
    <RandomizeNodePositions />
    {/* <NodeShapes /> */}
    {/* <EdgeShapes default="dotted" /> */}
    {/* <ForceLink background /> */}
    <NOverlap gridSize={20} nodeMargin={50} maxIterations={100} />
  </Sigma>
);
