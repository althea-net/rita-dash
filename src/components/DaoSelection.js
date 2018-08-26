import React, { Component } from "react";
import { Button, Col, Input, ListGroup, ListGroupItem, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { actions, connect } from "../store";

class DaoSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: ""
    };
    this.addressUpdated = this.addressUpdated.bind(this);
    this.addSubnetDao = this.addSubnetDao.bind(this);
  }
  componentDidMount() {
    actions.getSubnetDaos();
  }

  addressUpdated(e) {
    this.setState({ address: e.target.value });
  }

  addSubnetDao() {
    actions.addSubnetDao(this.state.address);
    this.setState({ address: "" });
  }

  render() {
    let { daos } = this.props.state;

    return (
      <div>
        <h2>Subnet DAO(s)</h2>
        <Row>
          <Col md="9">
            <Input
              placeholder="Put subnet DAO eth address here..."
              onChange={this.addressUpdated}
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
          </Col>
        </Row>
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
    );
  }
}

export default connect(["daos"])(DaoSelection);
