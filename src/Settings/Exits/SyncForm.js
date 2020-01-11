import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, FormGroup, Input, Label, Progress } from "reactstrap";
import { Error, Success } from "utils";
import { post } from "store";

const SyncForm = ({ setAdding, setUrlSync }) => {
  const [t] = useTranslation();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      await post("/exits/sync", { url });
      setSuccess(t("addExitSuccess"));
    } catch (e) {
      setError(t("addExitError"));
    }

    setLoading(false);
  };

  return (
        <Form onSubmit={submit}>
          {loading && <Progress animated color="primary" value="100" />}
          <Error error={error} />
          {success ? (
            <>
              <Success message={success} />
              <Button onClick={() => setAdding(false)}>{t("back")}</Button>
            </>
          ) : (
            <>
              <FormGroup>
                <Label>{t("url")}</Label>
                <Input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder={t("url")}
                  autoFocus
                />
              </FormGroup>
              <Button className="float-right" color="primary">
                {t("submit")}
              </Button>
              <Button
                className="float-right mr-1"
                onClick={() => setUrlSync(false)}
              >
                {t("back")}
              </Button>
            </>
          )}
        </Form>
  )
}

export default SyncForm;
