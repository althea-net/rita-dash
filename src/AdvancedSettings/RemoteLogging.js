import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, FormGroup, CustomInput, Input, Label } from "reactstrap";
import { RightCard } from "ui";
import { post, useStore } from "store";
import { Error, Success } from "utils";
import useInterval from "hooks/useInterval";
import useRemoteLogging from "hooks/useRemoteLogging";

const RemoteLogging = () => {
  const [t] = useTranslation();
  const [{ level, remoteLogging, waiting }, dispatch] = useStore();

  const [newLevel, setNewLevel] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [nowWaiting, setNowWaiting] = useState(false);

  useEffect(() => {
    if (level && !newLevel) setNewLevel(level);
    return;
  }, [level, newLevel]);

  useInterval(
    () => {
      if (nowWaiting) dispatch({ type: "keepWaiting" });
    },
    waiting ? 1000 : null
  );

  useRemoteLogging();

  const check = async e => {
    dispatch({ type: "startWaiting", waiting: 30 });
    dispatch({ type: "remoteLogging", remoteLogging: !remoteLogging });
    try {
      await post(`/remote_logging/enabled/${!remoteLogging}`);
    } catch (e) {}
  };

  const changeLevel = async e => {
    setNewLevel(e.target.value);
    setError(null);
    setSuccess(null);

    try {
      setNowWaiting(true);
      dispatch({ type: "startWaiting", waiting: 30 });
      await post(`/remote_logging/level/${e.target.value}`);
      dispatch({ type: "level", level });
      setSuccess(t("logLevelSuccess"));
    } catch (e) {
      if (e.message.includes("500")) {
        setError(t("logLevelError"));
      } else {
        setSuccess(t("logLevelSuccess"));
      }
    }
  };

  return (
    <RightCard>
      <h4>{t("remoteLogging")}</h4>
      <p>{t("remoteLoggingBlurb")}</p>

      <Error error={error} />
      <Success message={success} />

      <Form className="w-100">
        <FormGroup>
          <CustomInput
            type="checkbox"
            id="remoteLogging"
            onChange={check}
            checked={remoteLogging}
            label={t("remoteLogging")}
          />
        </FormGroup>
        <FormGroup>
          <Label for="level">{t("logLevel")}</Label>
          <Input
            name="level"
            placeholder={t("logLevel")}
            onChange={changeLevel}
            value={newLevel}
            type="select"
            className="mr-2 mb-2"
          >
            <option value="OFF">Off</option>
            <option value="ERROR">Error</option>
            <option value="WARN">Warn</option>
            <option value="INFO">Info</option>
            <option value="DEBUG">Debug</option>
            <option value="TRACE">Trace</option>
          </Input>
        </FormGroup>
      </Form>
    </RightCard>
  );
};

export default RemoteLogging;
