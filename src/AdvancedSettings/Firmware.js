import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";
import { connect } from "store";

import UpdateFirmware from "./UpdateFirmware";

export default connect(["info"])(({ state: { info } }) => {
  let [t] = useTranslation();
  let [checking, setChecking] = useState(false);
  let { version, ritaVersion } = info;

  return (
    <Card className="mb-4">
      <CardBody>
        <h3>{t("firmware")}</h3>
        <p>{t("version", { version, ritaVersion })}</p>

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
});
