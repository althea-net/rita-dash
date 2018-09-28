import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col
} from "reactstrap";
import { connect, actions } from "../store";
import { translate } from "react-i18next";
import port from "../images/port.png";

class Ports extends React.Component {
  componentDidMount = () => {
    actions.getInterfaces();
  };

  render() {
    let { interfaces } = this.props.state;
    if (!interfaces) return null;

    return (
      <div>
        <h2 style={{ marginTop: 20 }}>Ports</h2>
        <Row
          className="d-flex justify-content-center"
          style={{ marginBottom: 20 }}
        >
          {Object.keys(interfaces)
            .sort()
            .map((iface, i) => {
              if (iface[0] === "w") return null;

              return (
                <Card>
                  <CardBody>
                    <img src={port} alt="Port 1" width="60px" />
                    <span
                      style={{
                        position: "absolute",
                        top: 30,
                        left: 30,
                        fontWeight: "bold",
                        textShadow: "2px 2px #666",
                        color: "white",
                        maxWidth: 100
                      }}
                    >
                      {iface} {interfaces[iface]}
                    </span>
                  </CardBody>
                </Card>
              );
            })}
        </Row>
        <Row>
          <Col sm={12} md={{ size: 8, offset: 2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Port 1</CardTitle>
              </CardHeader>
              <CardBody>
                <p>
                  Mode: <strong>Mesh</strong>
                </p>
                <p>Switch mode to:</p>

                <Button color="primary" style={{ marginRight: 15 }}>
                  Mesh
                </Button>
                <Button color="primary" style={{ marginRight: 15 }}>
                  WAN (Gateway)
                </Button>
                <Button color="primary">LAN</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(["error", "loading", "success", "interfaces"])(
  translate()(Ports)
);
