import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input
} from "reactstrap";
import { useStore, post } from "store";

const Blockchain = () => {
  const [t] = useTranslation();
  const [success, setSuccess] = useState(false);

  const [{ blockchain }, dispatch] = useStore();
  const [newBlockchain, setBlockchain] = useState(blockchain);

  let submit = async e => {
    e.preventDefault();
    await post(`/blockchain/set/${newBlockchain}`);
    dispatch({ type: "blockchain", blockchain: newBlockchain });
    setSuccess(true);
  };

  return (
    <Card style={{ height: "100%", marginBottom: 20 }}>
      <CardBody>
        <Form onSubmit={submit}>
          <FormGroup id="form">
            <h3>{t("systemBlockchain")}</h3>
            {success ? (
              <Alert color="success">{t("blockchainSuccess")}</Alert>
            ) : (
              <Alert color="danger">{t("blockchainWarning")}</Alert>
            )}
            <Input
              label={t("blockchain")}
              name="blockchain"
              placeholder={t("enterBlockchain")}
              onChange={e => setBlockchain(e.target.value)}
              value={newBlockchain}
              type="select"
            >
              <option value="Ethereum">Ethereum (ETH)</option>
              <option value="Rinkeby">Rinkeby (tETH)</option>
              <option value="Xdai">Xdai (USD)</option>
            </Input>
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
