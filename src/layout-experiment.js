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

class Noverlap {
  constructor(graph, config) {
    this.graph = graph;
    this.nodeMap = graph.nodes.reduce((acc, node) => {
      acc[node.id] = node;
    }, {});
    this.config = {
      speed: 3,
      scaleNodes: 1.2,
      nodeMargin: 5.0,
      gridSize: 20,
      permittedExpansion: 1.1,
      rendererIndex: 0,
      maxIterations: 500,
      ...config
    };
  }

  atomicGo() {
    if (!this.running || this.iterCount < 1) return false;

    var nodes = this.graph.nodes,
      nodesCount = nodes.length,
      i,
      n,
      n1,
      n2,
      xmin = Infinity,
      xmax = -Infinity,
      ymin = Infinity,
      ymax = -Infinity,
      xwidth,
      yheight,
      xcenter,
      ycenter,
      grid,
      row,
      col,
      minXBox,
      maxXBox,
      minYBox,
      maxYBox,
      adjacentNodes,
      subRow,
      subCol,
      nxmin,
      nxmax,
      nymin,
      nymax;

    this.iterCount--;
    this.running = false;

    for (i = 0; i < nodesCount; i++) {
      n = nodes[i];
      n.dn.dx = 0;
      n.dn.dy = 0;

      //Find the min and max for both x and y across all nodes
      xmin = Math.min(
        xmin,
        n.dn_x - (n.dn_size * this.config.scaleNodes + this.config.nodeMargin)
      );
      xmax = Math.max(
        xmax,
        n.dn_x + (n.dn_size * this.config.scaleNodes + this.config.nodeMargin)
      );
      ymin = Math.min(
        ymin,
        n.dn_y - (n.dn_size * this.config.scaleNodes + this.config.nodeMargin)
      );
      ymax = Math.max(
        ymax,
        n.dn_y + (n.dn_size * this.config.scaleNodes + this.config.nodeMargin)
      );
    }

    xwidth = xmax - xmin;
    yheight = ymax - ymin;
    xcenter = (xmin + xmax) / 2;
    ycenter = (ymin + ymax) / 2;
    xmin = xcenter - this.config.permittedExpansion * xwidth / 2;
    xmax = xcenter + this.config.permittedExpansion * xwidth / 2;
    ymin = ycenter - this.config.permittedExpansion * yheight / 2;
    ymax = ycenter + this.config.permittedExpansion * yheight / 2;

    grid = {}; //An object of objects where grid[row][col] is an array of node ids representing nodes that fall in that grid. Nodes can fall in more than one grid

    for (row = 0; row < this.config.gridSize; row++) {
      grid[row] = {};
      for (col = 0; col < this.config.gridSize; col++) {
        grid[row][col] = [];
      }
    }

    //Place nodes in grid
    for (i = 0; i < nodesCount; i++) {
      n = nodes[i];

      nxmin =
        n.dn_x - (n.dn_size * this.config.scaleNodes + this.config.nodeMargin);
      nxmax =
        n.dn_x + (n.dn_size * this.config.scaleNodes + this.config.nodeMargin);
      nymin =
        n.dn_y - (n.dn_size * this.config.scaleNodes + this.config.nodeMargin);
      nymax =
        n.dn_y + (n.dn_size * this.config.scaleNodes + this.config.nodeMargin);

      minXBox = Math.floor(
        this.config.gridSize * (nxmin - xmin) / (xmax - xmin)
      );
      maxXBox = Math.floor(
        this.config.gridSize * (nxmax - xmin) / (xmax - xmin)
      );
      minYBox = Math.floor(
        this.config.gridSize * (nymin - ymin) / (ymax - ymin)
      );
      maxYBox = Math.floor(
        this.config.gridSize * (nymax - ymin) / (ymax - ymin)
      );
      for (col = minXBox; col <= maxXBox; col++) {
        for (row = minYBox; row <= maxYBox; row++) {
          grid[row][col].push(n.id);
        }
      }
    }

    adjacentNodes = {}; //An object that stores the node ids of adjacent nodes (either in same grid box or adjacent grid box) for all nodes

    for (row = 0; row < this.config.gridSize; row++) {
      for (col = 0; col < this.config.gridSize; col++) {
        grid[row][col].forEach(function(nodeId) {
          if (!adjacentNodes[nodeId]) {
            adjacentNodes[nodeId] = [];
          }
          for (
            subRow = Math.max(0, row - 1);
            subRow <= Math.min(row + 1, this.config.gridSize - 1);
            subRow++
          ) {
            for (
              subCol = Math.max(0, col - 1);
              subCol <= Math.min(col + 1, this.config.gridSize - 1);
              subCol++
            ) {
              grid[subRow][subCol].forEach(function(subNodeId) {
                if (
                  subNodeId !== nodeId &&
                  adjacentNodes[nodeId].indexOf(subNodeId) === -1
                ) {
                  adjacentNodes[nodeId].push(subNodeId);
                }
              });
            }
          }
        });
      }
    }

    //If two nodes overlap then repulse them
    for (i = 0; i < nodesCount; i++) {
      n1 = nodes[i];
      adjacentNodes[n1.id].forEach(function(nodeId) {
        var n2 = this.nodeMap[nodeId];
        var xDist = n2.dn_x - n1.dn_x;
        var yDist = n2.dn_y - n1.dn_y;
        var dist = Math.sqrt(xDist * xDist + yDist * yDist);
        var collision =
          dist <
          n1.dn_size * this.config.scaleNodes +
            this.config.nodeMargin +
            (n2.dn_size * this.config.scaleNodes + this.config.nodeMargin);
        if (collision) {
          this.running = true;
          if (dist > 0) {
            n2.dn.dx += xDist / dist * (1 + n1.dn_size);
            n2.dn.dy += yDist / dist * (1 + n1.dn_size);
          } else {
            n2.dn.dx += xwidth * 0.01 * (0.5 - Math.random());
            n2.dn.dy += yheight * 0.01 * (0.5 - Math.random());
          }
        }
      });
    }

    for (i = 0; i < nodesCount; i++) {
      n = nodes[i];
      if (!n.fixed) {
        n.dn_x = n.dn_x + n.dn.dx * 0.1 * this.config.speed;
        n.dn_y = n.dn_y + n.dn.dy * 0.1 * this.config.speed;
      }
    }

    if (this.running && this.iterCount < 1) {
      this.running = false;
    }

    return this.running;
  }
}
