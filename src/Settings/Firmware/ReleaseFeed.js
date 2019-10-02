import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { get, post } from "store";
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Progress
} from "reactstrap";

const ReleaseFeed = () => {
  const [t] = useTranslation();
  const [releaseFeed, setReleaseFeed] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        let releaseFeed = await get("/release_feed/get", false);
        setReleaseFeed(releaseFeed);
      } catch (e) {
        console.log(e);
      }

      setLoading(false);
    })();
  }, []);

  const change = e => {
    setReleaseFeed(e.target.value);
    setSuccess(false);
  };

  const submit = async e => {
    e.preventDefault();
    try {
      await post("/release_feed/set/" + releaseFeed);
      setSuccess(true);
    } catch (e) {
      setError(true);
    }
  };

  return (
    <Form onSubmit={submit}>
      {success && <Alert color="success">{t("releaseFeedSaved")}</Alert>}
      {error && <Alert color="danger">{t("problemSubmittingForm")}</Alert>}
      {loading ? (
        <Progress animated color="primary" value="100" />
      ) : (
        <FormGroup>
          <Label for="releaseFeed">{t("releaseFeed")}</Label>
          <div className="d-flex">
            <Input
              label={t("releaseFeed")}
              name="releaseFeed"
              onChange={change}
              value={releaseFeed}
              type="select"
            >
              <option value="GeneralAvailability">
                {t("generalAvailability")}
              </option>
              <option value="PreRelease">{t("preRelease")}</option>
              <option value="ReleaseCandidate">{t("releaseCandidate")}</option>
            </Input>
            <Button type="submit" color="primary" className="ml-2">
              {t("save")}
            </Button>
          </div>
        </FormGroup>
      )}
    </Form>
  );
};

export default ReleaseFeed;
