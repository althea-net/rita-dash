const MAXINT = 65535;

function normalize(current, smallest, greatest) {
  if (smallest === MAXINT) return 1;
  if (greatest === smallest) return 0;
  return greatest && (current - smallest) / (greatest - smallest);
}

function logNormalize(current, smallest, greatest) {
  console.log(current, smallest, greatest);
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

export default function normalizeNeighbors(neighborData) {
  const smallestRouteMetricToExit = getSmallestAtKey(
    "routeMetricToExit",
    neighborData
  );
  const greatestRouteMetricToExit = getGreatestAtKey(
    "routeMetricToExit",
    neighborData
  );

  const n = neighborData.map(neighbor => {
    return {
      ...neighbor,
      normalizedRouteMetricToExit: logNormalize(
        neighbor.routeMetricToExit,
        smallestRouteMetricToExit,
        greatestRouteMetricToExit
      )
    };
  });

  return n;
}
