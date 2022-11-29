import React, { useEffect, useState } from "react";
import { Card, CardBody } from "reactstrap";
import { get } from "store";
import Device from "./Device";
import { useTranslation } from "react-i18next";
import useInterval from "hooks/useInterval";
import ClipLoader from "react-spinners/ClipLoader";

const Devices = () => {
  const [loading, setLoading] = useState(null);
  const [devices, setDevices] = useState(null);
  let [t] = useTranslation();

  useInterval(async () => {
    try {
      let lanDevices = await get("/lan_devices");
      if (!(lanDevices instanceof Error)) setDevices(lanDevices.allLanDevices);
    } catch (e) {
      console.log(e);
    }
  }, 30000); // every 30 seconds

  useEffect(() => {
    (async () => {
      if (loading == null) {
        setLoading(true);
        let lanDevices = await get("/lan_devices");
        if (!(lanDevices instanceof Error))
          setDevices(lanDevices.allLanDevices);
        setLoading(false);
      }
    })();

    return;
  }, [loading]);

  if (loading) {
    return (
      <ClipLoader
        color="#89CFF0"
        loading={loading != null && loading}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );
  } else if (
    typeof devices === "undefined" ||
    devices === null ||
    devices.length === 0
  )
    return <div>{t("noDevices")}</div>;

  return (
    <Card>
      <CardBody>
        <div>
          {devices.map((device, index) => (
            <Device key={"Device" + index} newDevice={device} index={index} />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default Devices;
