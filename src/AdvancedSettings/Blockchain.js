import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Progress
} from "reactstrap";
import { actions, Context } from "store";

const Blockchain = () => {
  let [t] = useTranslation();

  let {
    state: { blockchain, loadingBlockchain, blockchainSuccess }
  } = useContext(Context);

  useEffect(() => {
    actions.getBlockchain();
  }, []);

  let [newBlockchain, setBlockchain] = useState(blockchain);
  if (!newBlockchain) newBlockchain = blockchain;

  let submit = async e => {
    e.preventDefault();
    await actions.setBlockchain(newBlockchain);
    actions.getInfo();
  };

  return (
    <Card style={{ height: "100%", marginBottom: 20 }}>
      <CardBody>
        <Form onSubmit={submit}>
          <FormGroup id="form">
            <h3>{t("systemBlockchain")}</h3>
            {blockchainSuccess ? (
              <Alert color="success">{t("blockchainSuccess")}</Alert>
            ) : (
              <Alert color="danger">{t("blockchainWarning")}</Alert>
            )}
            {loadingBlockchain ? (
              <Progress animated color="info" value="100" />
            ) : (
              <Input
                label={t("blockchain")}
                name="blockchain"
                placeholder={t("enterBlockchain")}
                onChange={e => setBlockchain(e.target.value)}
                value={newBlockchain}
                type="select"
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Rinkeby">Rinkeby</option>
                <option value="Xdai">Xdai</option>
              </Input>
            )}
          </FormGroup>
          <FormGroup>
            <Button color="primary">{t("save")}</Button>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Blockchain;
