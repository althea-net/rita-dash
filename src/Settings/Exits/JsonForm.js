import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, FormGroup, Input, Label, Progress } from "reactstrap";
import { Error, Success } from "utils";
import { post } from "store";

const JsonForm = ({ setAdding, setPasteJson }) => {
  const [t] = useTranslation();
  const [json, setJson] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      await post("/exits", JSON.parse(json));
      setSuccess(t("addExitSuccess"));
    } catch (e) {
      console.log(e);
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
                <Label>{t("exitJson")}</Label>
                <Input
                  type="textarea"
                  value={json}
                  onChange={e => setJson(e.target.value)}
                  placeholder={t("exitJson")}
                  autoFocus
                  rows={8}
                />
              </FormGroup>
              <Button className="float-right" color="primary">
                {t("submit")}
              </Button>
              <Button
                className="float-right mr-1"
                onClick={() => setPasteJson(false)}
              >
                {t("back")}
              </Button>
            </>
          )}
        </Form>
  )
}

export default JsonForm;
