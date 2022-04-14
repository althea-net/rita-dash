import React, { useEffect, useState } from "react";
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
import { get, post, useStore } from "store";

const Blockchain = () => {
  const [t] = useTranslation();
  const [success, setSuccess] = useState(false);

  const [{ blockchain }, dispatch] = useStore();
  const [newBlockchain, setBlockchain] = useState(blockchain);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    (async () => {
      try {
        const blockchain = await get("/blockchain/get", true, 5000, signal);
        if (!(blockchain instanceof Error)) {
          dispatch({ type: "blockchain", blockchain });
        }
      } catch (e) {}
    })();

    return () => controller.abort();
  }, [dispatch]);

  if (!blockchain || !newBlockchain) return null;

  let submit = async e => {
    e.preventDefault();
    try {
      await post(`/blockchain/set/${newBlockchain}`);
      dispatch({ type: "blockchain", blockchain: newBlockchain });

      const info = await get("/info", true, 5000);
      dispatch({ type: "info", info });

      const exits = await get("/exits", true, 8000);
      if (!(exits instanceof Error)) dispatch({ type: "exits", exits });
    } catch (e) {
      console.log(e);
    }
    setSuccess(true);
  };

  return (
    <Card className="mb-4 col-12 card-small">
      <CardBody>
        <Form onSubmit={submit}>
          <FormGroup id="form">
            <h4>{t("systemBlockchain")}</h4>
            {success && <Alert color="success">{t("blockchainSuccess")}</Alert>}
            <div className="d-flex flex-wrap">
              <Input
                label={t("blockchain")}
                name="blockchain"
                placeholder={t("enterBlockchain")}
                onChange={e => setBlockchain(e.target.value)}
                value={newBlockchain}
                type="select"
                className="mr-2 mb-2"
              >
                <option value="Ethereum">Ethereum (ETH)</option>
                <option value="Rinkeby">Rinkeby (tETH)</option>
                <option value="Xdai">Xdai (Dai / USD)</option>
              </Input>
              <Button color="primary">{t("save")}</Button>
            </div>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Blockchain;
