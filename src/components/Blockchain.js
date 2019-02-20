import React, { Component } from "react";
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
import { actions, connect } from "../store";
import { withTranslation } from "react-i18next";

class AdvancedSettings extends Component {
  state = {
    blockchain: null
  };

  componentDidMount() {
    actions.getBlockchain();
  }

  setBlockchain = e => {
    let blockchain = e.target.value;
    this.setState({ blockchain });
    actions.clearBlockchainSuccess();
  };

  onSubmit = e => {
    e.preventDefault();
    let blockchain = this.state.blockchain;
    actions.setBlockchain(blockchain);
  };

  render() {
    let { t } = this.props;
    let { blockchain } = this.state;
    if (blockchain === null) blockchain = this.props.state.blockchain;
    let { loadingBlockchain, blockchainSuccess } = this.props.state;

    return (
      <Card style={{ height: "100%", marginBottom: 20 }}>
        <CardBody>
          <Form onSubmit={this.onSubmit}>
            <FormGroup id="form">
              <h3>{t("systemBlockchain")}</h3>
              {blockchainSuccess && (
                <Alert color="success">{t("blockchainSuccess")}</Alert>
              )}
              {loadingBlockchain ? (
                <Progress animated color="info" value="100" />
              ) : (
                <Input
                  label={t("blockchain")}
                  name="blockchain"
                  placeholder={t("enterBlockchain")}
                  onChange={this.setBlockchain}
                  value={blockchain || ""}
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
  }
}

export default connect([
  "blockchain",
  "loadingBlockchain",
  "blockchainSuccess"
])(withTranslation()(AdvancedSettings));
