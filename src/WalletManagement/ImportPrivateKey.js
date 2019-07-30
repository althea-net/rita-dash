import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useInterval from "hooks/useInterval";
import { Alert, Button, Form, FormGroup, Input, Label } from "reactstrap";
import { get, post, useStore } from "store";
import refresh from "../images/refresh.svg";

const PrivateKey = () => {
  const [t] = useTranslation();
  const [privateKey, setPrivateKey] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [initiating, setInitiating] = useState(false);
  const [oldKey, setOldKey] = useState();

  const valid = parseInt(privateKey, 16) > 0;

  const [{ wgPublicKey }, dispatch] = useStore();

  useInterval(async () => {
    try {
      const wgPublicKey = await get("/wg_public_key");
      if (!(wgPublicKey instanceof Error))
        dispatch({ type: "wgPublicKey", wgPublicKey });
    } catch (e) {
      console.log(e);
    }
  }, 5000);

  useEffect(() => {
    (async () => {
      const wgPublicKey = await get("/wg_public_key");
      if (!(wgPublicKey instanceof Error)) setOldKey(wgPublicKey);
    })();
    return;
  }, []);

  const save = async e => {
    e.preventDefault();

    post("/eth_private_key", { eth_private_key: privateKey });
    setInitiating(true);
  };

  const confirm = e => {
    e.preventDefault();
    setConfirming(true);
  };

  const cancel = () => setConfirming(false);

  return (
    <>
      <h6>{t("replaceAccount")}</h6>
      <div className="d-flex mt-2">
        <div className="col-4 col-md-3 text-center my-auto">
          <img
            src={refresh}
            alt={t("refreshSymbol")}
            className="img-fluid"
            style={{ maxWidth: 80 }}
          />
        </div>
        <div className="col-8 col-md-9">
          {confirming ? (
            <>
              {oldKey === wgPublicKey ? (
                initiating ? (
                  <Alert color="warning">
                    {t("privateKeyImportInitiated")}
                  </Alert>
                ) : (
                  <>
                    <Alert color="warning">
                      {t("privateKeyImportWarning")}
                    </Alert>
                    <p>{t("proceed")}</p>
                    <Button color="primary" onClick={save}>
                      {t("yes")}
                    </Button>
                    <Button color="secondary" onClick={cancel}>
                      {t("no")}
                    </Button>
                  </>
                )
              ) : (
                <Alert color="success">{t("privateKeySuccess")}</Alert>
              )}
            </>
          ) : (
            <Form onSubmit={confirm}>
              <p className="mb-0">{t("ifYouWant")}</p>

              <FormGroup>
                <Label for="privateKey">{t("newPrivateKey")}</Label>
                <div className="d-flex flex-wrap">
                  <Input
                    className="mr-3 mb-2"
                    id="privateKey"
                    name="privateKey"
                    onChange={e => setPrivateKey(e.target.value)}
                    value={privateKey}
                    style={{ width: 350 }}
                  />
                  <Button
                    color="primary"
                    style={{ width: 100 }}
                    disabled={!valid}
                  >
                    {t("import")}
                  </Button>
                </div>
              </FormGroup>
            </Form>
          )}
        </div>
      </div>
    </>
  );
};

export default PrivateKey;
