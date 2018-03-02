import { isRequired, isOptional, isObjectOf, label } from "nested-validate";
import { isNumber, isString, isBoolean } from "core-util-is";

const isEncryptionType = type => isString(type) && /(psk2|psk|wep)/.test(type);

export const isDeviceName = isRequired(isString);

export const wifiSettings = {
  device_name: isDeviceName,
  mesh: isOptional(isBoolean),
  ssid: isOptional(isString),
  encryption: isOptional(type => isString(type) && /(psk2|psk|wep)/.test(type)),
  key: isOptional(isString)
};
