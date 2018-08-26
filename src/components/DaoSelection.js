import React, { Component } from "react";
import { Button, Col, Input, ListGroup, ListGroupItem, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class DaoSelection extends Component {
  render() {
    return (
      <div>
        <h2>Subnet DAO(s)</h2>
        <Row>
          <Col md="9">
            <Input placeholder="Put subnet DAO eth address here..." />
          </Col>
          <Col md="3">
            <Button color="primary" className="float-right">
              Add subnet DAO
            </Button>
          </Col>
        </Row>
        <ListGroup style={{ marginTop: 10 }}>
          {[1, 2, 3].map(i => {
            return (
              <ListGroupItem>
                <Button
                  className="float-right"
                  style={{ background: "white", color: "black" }}
                >
                  <FontAwesomeIcon icon="minus-circle" color="black" />
                  &nbsp; Remove
                </Button>
                0xaepjgjaslkdjalksjd9812j2{" "}
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </div>
    );
  }
}

export default DaoSelection;
