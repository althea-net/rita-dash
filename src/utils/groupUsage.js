import { toEth } from "utils";
import { format } from "date-fns";
import { BigNumber } from "bignumber.js";

const msPerHr = 3600000;
const bytesPerGb = BigNumber("1000000000");

const groupData = (usage, period, symbol, locale, page, limit, payments) => {
  let data = {};

  let indices = usage.map(h => h.index);

  indices.map(index => {
    const date = new Date(index * msPerHr);
    let i;

    switch (period) {
      case "h":
        i = index;
        break;
      case "d":
        i =
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          ).getTime() / msPerHr;
        break;
      case "w":
        i =
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - date.getDay()
          ).getTime() / msPerHr;
        break;
      default:
      case "m":
        i =
          new Date(date.getFullYear(), date.getMonth(), 1).getTime() / msPerHr;
        break;
    }

    if (!data[i]) data[i] = { up: 0, down: 0, cost: 0, service: 0 };

    let c = usage.find(c => c.index === index);

    if (payments.length) {
      let p = payments.find(p => p.index === index);
      if (p) {
        data[i].service += p.payments
          .filter(p => p.to.meshIp === "::1")
          .reduce((a, b) => a + parseInt(b.amount), 0);

        data[i].cost += p.payments
          .filter(p => p.to.meshIp !== "::1")
          .reduce((a, b) => a + parseInt(b.amount), 0);
      }
    } else {
      data[i].cost += c.price * (c.up + c.down);
    }

    data[i].up += c.up;
    data[i].down += c.down;

    return c;
  });

  const start = hour => {
    let date = new Date(hour * msPerHr);

    switch (period) {
      case "m":
        return format(date, "MMM", { locale });
      case "d":
        return format(date, "MMM dd", { locale });
      case "w":
        return format(date, "MMM dd", { locale });
      case "h":
      default:
        return format(date, "MMM dd, HH:SS", { locale });
    }
  };

  const end = hour => {
    let date = new Date(hour * msPerHr);

    switch (period) {
      case "m":
        date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        return format(date, "MMM YYYY", { locale });
      case "d":
        date = new Date((parseInt(hour) + 24) * msPerHr);
        return format(date, "dd, YYYY", { locale });
      case "w":
        date = new Date((parseInt(hour) + 7 * 24) * msPerHr);
        return format(date, "MMM dd, YYYY", { locale });
      case "h":
      default:
        date = new Date((parseInt(hour) + 1) * msPerHr);
        return format(date, "HH:SS", { locale });
    }
  };

  const rows = Object.keys(data)
    .reverse()
    .slice((page - 1) * limit, page * limit)
    .map(d => ({
      index: d,
      period: `${start(d)} - ${end(d)}`,
      usage:
        BigNumber(data[d].up + data[d].down)
          .div(bytesPerGb)
          .toFixed(4) + "GB",
      bandwidthCost: `${toEth(data[d].cost, 4)} ${symbol}`,
      serviceCost: `${toEth(data[d].service, 4)} ${symbol}`,
      totalCost: `${toEth(data[d].cost + data[d].service, 4)} ${symbol}`
    }));

  return [rows, data];
};

export default groupData;
