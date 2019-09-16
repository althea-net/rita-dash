import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Form, FormGroup, CustomInput } from "reactstrap";
import { useStore } from "store";

const BandwidthSelling = () => {
  const [t] = useTranslation();
  const [{ sellingBandwidth }, dispatch] = useStore();

  const check = e => {
    dispatch({ type: "sellingBandwidth", sellingBandwidth: !sellingBandwidth });
  };

  return (
    <Card className="mb-4 mr-lg-2 col-12 card-small">
      <CardBody>
        <h4>{t("sellingBandwidth")}</h4>
        <Form>
          <FormGroup>
            <CustomInput
              type="checkbox"
              id="bandwidthSelling"
              onChange={check}
              checked={sellingBandwidth}
              label={t("enableBandwidthSelling")}
            />
          </FormGroup>
        </Form>
        <p
          dangerouslySetInnerHTML={{
            __html: t("learnMoreAboutTheEquipment")
          }}
        />
      </CardBody>
    </Card>
  );
};

export default BandwidthSelling;
