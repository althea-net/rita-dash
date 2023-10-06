import { toEth } from "utils";
import { format } from "date-fns";
import { BigNumber } from "bignumber.js";

const msPerHr = 3600000;
const bytesPerGb = BigNumber("1000000000");

// takes client usage data and correlates it with payment data
const groupRelayUsageData = (
  // takes our_info to identify who is us in the payment 'from' and 'to' fields
  our_info,
  // client usage
  client_usage,
  // relay_usage
  relay_usage,
  period,
  symbol,
  locale,
  page,
  limit,
  payments
) => {
  let data = {};

  let indices = relay_usage.map((h) => h.index);

  indices.map((index) => {
    const date = new Date(index * msPerHr);
    let i;

    // day weeek and month
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

    // fill missing data with zeros
    if (!data[i]) data[i] = { up: 0, down: 0, cost: 0, service: 0 };

    let relayUsageIndex = relay_usage.find((c) => c.index === index);
    let clientUsageIndex = client_usage.find((c) => c.index === index);

    if (payments && payments.length) {
      // all payments for this period
      let p = payments.find((p) => p.index === index);
      if (p) {
        // this relies on us having the same eth address as the payment records
        // if you are copying payment records from one router to another and always
        // see zero for your own usage cost this right here is why. You can either set
        // the same eth address locally, or uncomment the 'easy' block below and comment
        // this out.
        // As for what this actually does, this is where we toggle between filtering payments
        // from us and payments to us when we determine client costs and relay income
        if (our_info) {
          // as a relay since Althea is a pay per forward system you get lump sum payments
          // that include your earnings plus what must be paid downstream, the relay keeps their share
          // and sends the rest downstream, so we can't just take the sum value of all tx to us as 'relay income'
          // sadly we lack a 'payment purpose' classifier in the existing data meaning it's hard to tell client payments
          // from relay forwarding payments, so we have to muddle it out here.
          // what is actually being computed is NET change in wallet balance, not clietn spending or relay earnings
          let totalEarnings = p.payments
            .filter(
              (p) =>
                p.to.ethAddress.toLowerCase() === our_info.address.toLowerCase()
            )
            .reduce((a, b) => a + parseInt(b.amount), 0);
          let totalSpending = p.payments
            .filter(
              (p) =>
                p.from.ethAddress.toLowerCase() ===
                our_info.address.toLowerCase()
            )
            .reduce((a, b) => a + parseInt(b.amount), 0);

          data[i].cost += totalEarnings - totalSpending;
        }
      }
    }

    // For client traffic upload and download are both distinct values billed differently
    // Relay download is taking relay traffic in to forward, relay upload is forwarding it, so any
    // difference between these values is the number of packets currently buffered in memory at the time
    // of the sample. Becuase of this we should only show relay upload or download as relay usage or we 'double' the value.
    // likewise relay bandwidth actually includes client bandwidth, meaning that client bw is handed directly to the forwarding engine
    // used to relay all other traffic, so we subtract the combined client usage in the same index
    if (clientUsageIndex) {
      data[i].down +=
        relayUsageIndex.down - (clientUsageIndex.up + clientUsageIndex.down);
    } else {
      data[i].down += relayUsageIndex.down;
    }

    return relayUsageIndex;
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
        return format(date, "MMM yyyy", { locale });
      case "d":
        date = new Date((parseInt(hour) + 24) * msPerHr);
        return format(date, "dd, yyyy", { locale });
      case "w":
      default:
        date = new Date((parseInt(hour) + 7 * 24) * msPerHr);
        return format(date, "MMM dd, yyyy", { locale });
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

// takes client usage data and correlates it with payment data
const groupClientUsageData = (
  // takes our_info to identify who is us in the payment 'from' and 'to' fields
  our_info,
  // client usage
  client_usage,
  period,
  symbol,
  locale,
  page,
  limit,
  payments
) => {
  let data = {};

  let indices = client_usage.map((h) => h.index);

  indices.map((index) => {
    const date = new Date(index * msPerHr);
    let i;

    // day weeek and month
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

    // fill missing data with zeros
    if (!data[i]) data[i] = { up: 0, down: 0, cost: 0, service: 0 };

    let c = client_usage.find((c) => c.index === index);

    if (payments && payments.length) {
      let p = payments.find((p) => p.index === index);
      if (p) {
        // payments for operator fees or simulated tx fees have a to mesh ip of the localhost value
        // as a hacky filter, so this is how we find these
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
          // as a relay since Althea is a pay per forward system you get lump sum payments
          // that include your earnings plus what must be paid downstream, the relay keeps their share
          // and sends the rest downstream, so we can't just take the sum value of all tx to us as 'relay income'
          // sadly we lack a 'payment purpose' classifier in the existing data meaning it's hard to tell client payments
          // from relay forwarding payments, so we have to muddle it out here.
          // what is actually being computed is NET change in wallet balance, not clietn spending or relay earnings
          let totalEarnings = p.payments
            .filter(
              (p) =>
                p.to.ethAddress.toLowerCase() === our_info.address.toLowerCase()
            )
            .reduce((a, b) => a + parseInt(b.amount), 0);
          let totalSpending = p.payments
            .filter(
              (p) =>
                p.from.ethAddress.toLowerCase() ===
                our_info.address.toLowerCase()
            )
            .filter((p) => p.to.meshIp !== "::1")
            .reduce((a, b) => a + parseInt(b.amount), 0);

          // this is the NET balance change of the router not the client usage specifically
          data[i].cost += totalSpending - totalEarnings;
        }
      }
    }

    // For client traffic upload and download are both distinct values billed differently
    // Relay download is taking relay traffic in to forward, relay upload is forwarding it, so any
    // difference between these values is the number of packets currently buffered in memory at the time
    // of the sample. Becuase of this we should only show relay upload or download as relay usage or we 'double' the value.
    // likewise relay bandwidth actually includes client bandwidth, meaning that client bw is handed directly to the forwarding engine
    // used to relay all other traffic, so it will by default be included in the count
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
        return format(date, "MMM yyyy", { locale });
      case "d":
        date = new Date((parseInt(hour) + 24) * msPerHr);
        return format(date, "dd, yyyy", { locale });
      case "w":
      default:
        date = new Date((parseInt(hour) + 7 * 24) * msPerHr);
        return format(date, "MMM dd, yyyy", { locale });
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

export { groupClientUsageData, groupRelayUsageData };
