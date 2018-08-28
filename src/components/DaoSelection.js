import React, { Component } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  FormFeedback,
  Input,
  ListGroup,
  ListGroupItem,
  Row
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { actions, connect } from "../store";
import web3 from "web3";
import Error from "./Error";

class DaoSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      valid: false
    };
    this.web3 = new web3();
  }
  componentDidMount() {
    actions.getSubnetDaos();
  }

  addressUpdated = e => {
    let address = e.target.value;
    this.setState({ address, valid: web3.utils.isAddress(address) });
  };

  addSubnetDao = () => {
    actions.addSubnetDao(this.state.address);
    this.setState({ address: "" });
  };

  render() {
    let { daos, daosError } = this.props.state;

    return (
      <div>
        <h2>Subnet DAO(s)</h2>
        {daosError ? (
          <Error error={daosError} />
        ) : (
          <div>
            <Form>
              <FormGroup>
                <Row>
                  <Col md="9">
                    <Input
                      placeholder="Put subnet DAO eth address here..."
                      onChange={this.addressUpdated}
                      valid={this.state.valid}
                      invalid={!(this.state.valid || !this.state.address)}
                      value={this.state.address}
                    />
                  </Col>
                  <Col md="3">
                    <Button
                      color="primary"
                      className="float-right"
                      onClick={this.addSubnetDao}
                    >
                      Add subnet DAO
                    </Button>
                    <FormFeedback invalid="true">
                      Please enter a valid Ethereum address
                    </FormFeedback>
                  </Col>
                </Row>
              </FormGroup>
            </Form>
            <ListGroup style={{ marginTop: 10 }}>
              {daos.map((address, i) => {
                return (
                  <ListGroupItem key={i}>
                    <Button
                      className="float-right"
                      style={{ background: "white", color: "black" }}
                      onClick={() => {
                        actions.removeSubnetDao(address);
                      }}
                    >
                      <FontAwesomeIcon icon="minus-circle" color="black" />
                      &nbsp; Remove
                    </Button>
                    {address}
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          </div>
        )}
      </div>
    );
  }
}

export default connect(["daos", "daosError"])(DaoSelection);
