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
  InputGroup,
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
    <Card className="mb-4">
      <CardBody>
        <h3>{t("routerNickname")}</h3>
        <Form onSubmit={submit}>
          <p>{t("otherRouters")}</p>

          {success && <Alert color="success">{t("nicknameUpdated")}</Alert>}

          {loading ? (
            <Progress animated color="info" value="100" />
          ) : (
            <FormGroup>
              <Label for="price">{t("nickname")}</Label>
              <div className="d-flex">
                <InputGroup className="mr-3" style={{ width: 350 }}>
                  <Input
                    label={t("nickname")}
                    name="nickname"
                    id="nickname"
                    onChange={e => setNewNickname(e.target.value)}
                    value={newNickname}
                    style={{ borderRight: "none" }}
                  />
                </InputGroup>
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
