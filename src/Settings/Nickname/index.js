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
import { get, post } from "store";

const Nickname = () => {
  const [t] = useTranslation();

  const [nickname, setNickname] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        let nickname = await get("/nickname/get");
        if (!(nickname instanceof Error)) setNickname(nickname);
      } catch {}

      setLoading(false);
    })();
  }, []);

  const submit = async e => {
    e.preventDefault();

    try {
      await post("/nickname/set", { nickname: nickname });
      setSuccess(true);
    } catch {}
  };

  return (
    <Card className="mb-2">
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
                    onChange={e => setNickname(e.target.value)}
                    value={nickname}
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
