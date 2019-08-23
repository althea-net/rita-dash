import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Progress,
  Label
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { post, useStore } from "store";
import useNickname from "hooks/useNickname";

const Nickname = () => {
  const [t] = useTranslation();

  const [success, setSuccess] = useState(false);
  const [{ nickname }, dispatch] = useStore();
  const [newNickname, setNewNickname] = useState(nickname || "");
  const [loading] = useNickname();

  useEffect(
    () => {
      setNewNickname(nickname);
    },
    [nickname]
  );

  const submit = async e => {
    e.preventDefault();

    try {
      await post("/nickname/set", { nickname: newNickname });
      dispatch({ type: "nickname", nickname: newNickname });
      setSuccess(true);
    } catch {}
  };

  return (
    <Card className="mb-4 shadow" id="nicknameCard">
      <CardBody>
        <h4>{t("routerNickname")}</h4>
        <Form onSubmit={submit}>
          <p>{t("otherRouters")}</p>

          {success && <Alert color="success">{t("nicknameUpdated")}</Alert>}

          {loading ? (
            <Progress animated color="info" value="100" />
          ) : (
            <FormGroup>
              <Label for="price">{t("nickname")}</Label>
              <div className="d-flex">
                <Input
                  label={t("nickname")}
                  name="nickname"
                  id="nickname"
                  onChange={e => setNewNickname(e.target.value)}
                  value={newNickname}
                  style={{ maxWidth: 350 }}
                  className="mr-2"
                />
                <Button type="submit" color="primary">
                  {t("save")}
                </Button>
              </div>
            </FormGroup>
          )}
        </Form>
      </CardBody>
    </Card>
  );
};

export default Nickname;
