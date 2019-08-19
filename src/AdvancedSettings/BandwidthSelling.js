import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Form, FormGroup, CustomInput } from "reactstrap";

const BandwidthSelling = () => {
  const [t] = useTranslation();
  const [checked, setChecked] = useState(false);

  return (
    <Card className="mb-4 mr-lg-2 col-12 small">
      <CardBody>
        <h4>{t("bandwidthSelling")}</h4>
        <Form>
          <FormGroup>
            <CustomInput
              type="checkbox"
              id="bandwidthSelling"
              onChange={() => setChecked(!checked)}
              checked={checked}
              label={t("enableBandwidthSelling")}
            />
          </FormGroup>
          <p
            dangerouslySetInnerHTML={{
              __html: t("learnMoreAboutTheEquipment")
            }}
          />
        </Form>
      </CardBody>
    </Card>
  );
};

export default BandwidthSelling;
