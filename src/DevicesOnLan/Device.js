import React from "react";
import { useTranslation } from "react-i18next";
import { Card } from "reactstrap";

const Device = (props) => {
  let [t] = useTranslation();

  return (
    <div>
      <Card>
        <p>
          <b>{t("device")}</b>: {props.newDevice.name}
          <br></br>
          <b>{t("signalStrength")}</b>:
          {format_signal_strength(props.newDevice.signalStrength)}
          <br></br>
          <b>{t("uploadedBytes")}</b>:
          {prettyBytes(props.newDevice.uploadBytesUsed)}
          <br></br>
          <b>{t("downloadedBytes")}</b>:
          {prettyBytes(props.newDevice.downloadBytesUsed)}
          <br></br>
          <b>{t("ipAddr")}</b>: {format_ips(props.newDevice.ipAddr)}
          <br></br>
          <b>{t("macAddr")}</b>: {props.newDevice.macAddr}
          <br></br>
          <b>{t("wired")}</b>: {t(props.newDevice.wired.toString())}
        </p>
      </Card>
    </div>
  );
};

function prettyBytes(bytes) {
  if (bytes === null) return " N/A";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10),
    sizes.length - 1
  );
  return ` ${(bytes / 1024 ** i).toFixed(i ? 1 : 0)}${sizes[i]}`;
}

function format_ips(ips) {
  let ip4index = 0;
  let ip6index = 0;
  let ipv4 = [];
  let ipv6 = [];

  const regexIp6 =
    /^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$/m;
  const regexIp4 =
    /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/m;
  for (let i = 0; i < ips.length; i++) {
    let ipAddr = ips[i];
    if (regexIp4.test(ipAddr)) {
      ipv4[ip4index] = ipAddr;
      ip4index += 1;
    } else if (regexIp6.test(ipAddr)) {
      ipv6[ip6index] = ipAddr;
      ip6index += 1;
    }
  }
  let all_ips = ipv4.concat(ipv6);
  return all_ips.join(", ");
}

function format_signal_strength(signalStrength) {
  if (signalStrength !== null) {
    return " " + signalStrength.replace(/ *\[[^\]]*]/, "");
  } else return " N/A";
}

export default Device;
