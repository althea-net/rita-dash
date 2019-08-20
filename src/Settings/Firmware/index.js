import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";
import { useStore } from "store";

import UpdateFirmware from "./UpdateFirmware";
import ReleaseFeed from "./ReleaseFeed";

const Firmware = () => {
  const [t] = useTranslation();
  const [checking, setChecking] = useState(false);
  const [{ version, ritaVersion }] = useStore();

  return (
    <Card className="mb-4 col-md-6 mr-2">
      <CardBody>
        <h4>{t("firmware")}</h4>
        <p>{t("version", { version, ritaVersion })}</p>

        <ReleaseFeed />
        <UpdateFirmware open={checking} setOpen={setChecking} />

        <Button
          color="secondary"
          id="update"
          style={{ width: 200 }}
          onClick={() => setChecking(true)}
        >
          {t("updateNow")}
        </Button>
      </CardBody>
    </Card>
  );
};

export default Firmware;
