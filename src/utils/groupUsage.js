import { toEth } from "utils";
import { format } from "date-fns";
import { BigNumber } from "bignumber.js";

const msPerHr = 3600000;
const bytesPerGb = BigNumber("1000000000");

// takes usage data and correlates it with payment data, used for both relay usage
// and client usage with slightly different arguments
const groupData = (
  // takes our_info to identify who is us in the payment 'from' and 'to' fields
  our_info,
  // boolean true/false if false we're doing relay billing
  client,
  usage,
  period,
  symbol,
  locale,
  page,
  limit,
  payments
) => {
  let data = {};

  let indices = usage.map((h) => h.index);

  indices.map((index) => {
    const date = new Date(index * msPerHr);
    let i;

    switch (period) {
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

    let c = usage.find((c) => c.index === index);

    if (payments && payments.length) {
      let p = payments.find((p) => p.index === index);
      if (p) {
        data[i].service += p.payments
          .filter((p) => p.to.meshIp === "::1")
          .reduce((a, b) => a + parseInt(b.amount), 0);

        // this relies on us having the same eth address as the payment records
        // if you are copying payment records from one router to another and always
        // see zero for your own usage cost this right here is why. You can either set
        // the same eth address locally, or uncomment the 'easy' block below and comment
        // this out.
        // As for what this actually does, this is where we toggle between filtering payments
        // from us and payments to us when we determine client costs and relay income
        if (our_info) {
          if (client) {
            data[i].cost += p.payments
              .filter(
                (p) =>
                  p.from.ethAddress.toLowerCase() ===
                  our_info.address.toLowerCase()
              )
              .filter((p) => !(p.to.meshIp === "::1"))
              .reduce((a, b) => a + parseInt(b.amount), 0);
          } else {
            data[i].cost += p.payments
              .filter(
                (p) =>
                  p.to.ethAddress.toLowerCase() ===
                  our_info.address.toLowerCase()
              )
              .filter((p) => !(p.to.meshIp === "::1"))
              .reduce((a, b) => a + parseInt(b.amount), 0);
          }
        }
      }
    }
    // Hey you developer! uncomment this for a very close (only missing tx fees)
    // estimate, this is good if you have decided that the lack of portability in
    // the tx history is bad idea
    //data[i].cost += c.price * (c.up + c.down);

    data[i].up += c.up;
    data[i].down += c.down;

    return c;
  });

  const start = (hour) => {
    let date = new Date(hour * msPerHr);

    switch (period) {
      case "m":
        return format(date, "MMM", { locale });
      case "d":
        return format(date, "MMM dd", { locale });
      default:
      case "w":
        return format(date, "MMM dd", { locale });
    }
  };

  const end = (hour) => {
    let date = new Date(hour * msPerHr);

    switch (period) {
      case "m":
        date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        return format(date, "MMM YYYY", { locale });
      case "d":
        date = new Date((parseInt(hour) + 24) * msPerHr);
        return format(date, "dd, YYYY", { locale });
      case "w":
      default:
        date = new Date((parseInt(hour) + 7 * 24) * msPerHr);
        return format(date, "MMM dd, YYYY", { locale });
    }
  };

  const rows = Object.keys(data)
    .reverse()
    .slice((page - 1) * limit, page * limit)
    .map((d) => ({
      index: d,
      period: `${start(d)} - ${end(d)}`,
      usage:
        BigNumber(data[d].up + data[d].down)
          .div(bytesPerGb)
          .toFixed(4) + "GB",
      bandwidthCost: `${toEth(data[d].cost, 4)} ${symbol}`,
      serviceCost: `${toEth(data[d].service, 4)} ${symbol}`,
      totalCost: `${toEth(data[d].cost + data[d].service, 4)} ${symbol}`,
    }));

  return [rows, data];
};

export default groupData;
