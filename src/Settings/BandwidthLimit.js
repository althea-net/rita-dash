import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  CustomInput,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Progress,
} from "reactstrap";
import { get, post } from "store";
import { Card } from "ui";

const BandwidthLimit = () => {
  const [t] = useTranslation();
  const [limit, setLimit] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  let buttonColor;
  if (unsavedChanges) {
    buttonColor = "primary";
  } else {
    buttonColor = "secondary";
  }

  const getCurrentLimit = async () => {
    try {
      const limit_in_mbps = await get("/bandwidth_limit", true, 5000);

      if (limit_in_mbps) {
        setLimit(Number(limit_in_mbps));
      } else {
        setLimit(null);
      }
    } catch {}

    setLoading(false);
  };

  if (loading) {
    getCurrentLimit();
  }

  function toggleLimit(e) {
    setUnsavedChanges(true);
    if (limit == null) {
      setLimit(50);
    } else {
      setLimit(null);
    }
  }

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    var limitString;
    if (limit) {
      limitString = Number(limit);
    } else {
      limitString = "disable";
    }

    try {
      await post(`/bandwidth_limit/${limitString}`);
      setSuccess(true);
      setUnsavedChanges(false);
      setLoading(true);
    } catch {}
  };

  return (
    <Card>
      <Form onSubmit={submit}>
        <h4>{t("bandwidth")}</h4>
        <p>
          {t("setYourBandwidth")} <a href="tel:8664258432">1-866-4ALTHEA</a>
        </p>

        {loading && <Progress animated color="primary" value="100" />}
        {success && <Alert color="success">{t("bandwidthLimitSaved")}</Alert>}
        <FormGroup id="form">
          <Label for="bandwidthLimit">{t("bandwidthLimitTitle")}</Label>
          <div className="d-flex flex-wrap">
            <InputGroup className="mr-2 mb-2" style={{ width: 320 }}>
              <Input
                label={t("bandwidth")}
                name="bandwidth"
                id="selfLimitSpeed"
                placeholder={t("enterSpeed")}
                onChange={(e) => {
                  setLimit(e.target.value);
                  setUnsavedChanges(true);
                }}
                value={limit || ""}
                readOnly={limit == null}
                style={{ borderRight: "none" }}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText
                  style={{
                    background: "#F8F9FA",
                    fontSize: 14,
                    color: "#888",
                  }}
                >
                  Mbps
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <div>
              <Button color={buttonColor}>{t("save")}</Button>
            </div>
          </div>
        </FormGroup>
        <FormGroup className="d-flex">
          <CustomInput
            type="checkbox"
            id="autoPricing"
            onChange={toggleLimit}
            value={limit != null}
            checked={limit != null}
          />
          <Label for="enableSelfLimit">{t("enableSelfLimit")}</Label>
        </FormGroup>
      </Form>
    </Card>
  );
};

export default BandwidthLimit;
