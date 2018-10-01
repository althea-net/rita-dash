import React from "react";
import {
  Alert,
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
import portImage from "../images/port.png";

class Ports extends React.Component {
  componentDidMount = () => {
    actions.getInterfaces();
  };

  render() {
    let { interfaces, port } = this.props.state;
    let modes = ["Mesh", "WAN", "LAN"];
    if (!interfaces)
      return <Alert color="info">No port interfaces found</Alert>;

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
                <Card
                  style={{ cursor: "pointer" }}
                  onClick={() => actions.setPort(iface)}
                  className={port === iface ? "bg-primary" : null}
                  key={i}
                >
                  <CardBody>
                    <img src={portImage} alt={iface} width="60px" />
                    <span
                      style={{
                        position: "absolute",
                        top: 25,
                        left: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        textShadow: "2px 2px #666",
                        color: "white",
                        maxWidth: 60
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
                <CardTitle>{port}</CardTitle>
              </CardHeader>
              <CardBody>
                <p>
                  Mode: <strong>{interfaces[port]}</strong>
                </p>
                <p>Switch mode to:</p>

                {modes.map((mode, i) => {
                  return (
                    <Button
                      color={
                        mode === interfaces[port] ? "secondary" : "primary"
                      }
                      key={i}
                      style={{ marginRight: 15 }}
                      disabled={mode === interfaces[port]}
                      onClick={() => actions.setInterfaces(mode)}
                    >
                      {mode} {mode === "WAN" && "(Gateway)"}
                    </Button>
                  );
                })}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(["error", "loading", "port", "success", "interfaces"])(
  translate()(Ports)
);
