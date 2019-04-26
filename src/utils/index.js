import { default as Error } from "./Error";
import { default as NoConnection } from "./NoConnection";
import { default as Success } from "./Success";
import { default as Confirm } from "./Confirm";

import { BigNumber } from "bignumber.js";
const weiPerEth = BigNumber("1000000000000000000");

const toEth = n => {
  if (!n && n !== 0) return null;

  return BigNumber(n.toString())
    .div(weiPerEth)
    .toFixed(4);
};

const toWei = n => {
  if (!n && n !== 0) return null;

  return BigNumber(n.toString())
    .times(weiPerEth)
    .toString();
};

export { Error, NoConnection, Success, Confirm, toEth, toWei };
