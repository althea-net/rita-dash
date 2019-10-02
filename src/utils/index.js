import { default as Error } from "./Error";
import { default as Warning } from "./Warning";
import { default as NoConnection } from "./NoConnection";
import { default as Success } from "./Success";
import { default as Confirm } from "./Confirm";
import { default as Flags } from "./Flags";
import { default as groupUsage } from "./groupUsage";

import { BigNumber } from "bignumber.js";
const weiPerEth = BigNumber("1000000000000000000");

const toEth = (n, i = 4) => {
  if (!n && n !== 0) return null;

  return BigNumber(n.toString())
    .div(weiPerEth)
    .toFixed(i);
};

const toWei = n => {
  if (!n && n !== 0) return null;

  return BigNumber(n.toString())
    .times(weiPerEth)
    .toString();
};

const txLink = (blockchain, txid) => {
  let link;
  switch (blockchain) {
    case "Rinkeby":
      link = `https://rinkeby.etherscan.io/tx/${txid}`;
      break;
    case "Xdai":
      link = `https://blockscout.com/poa/dai/tx/${txid}`;
      break;
    case "Ethereum":
    default:
      link = `https://etherscan.io/tx/${txid}`;
      break;
  }

  return link;
};

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

export {
  Error,
  Flags,
  NoConnection,
  Success,
  Confirm,
  toEth,
  toWei,
  txLink,
  sleep,
  groupUsage,
  Warning
};
