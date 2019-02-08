import React from "react";
import { Alert, Button, Card, CardBody, Progress, Row } from "reactstrap";
import { connect, actions, getState } from "../store";
import { withTranslation } from "react-i18next";
import portImage from "../images/port.png";
import glImage from "../images/gl.jpg";
import portOrderings from "../portOrderings";
import Confirm from "./Confirm";

class Ports extends React.Component {
  constructor() {
    super();
    this.state = {
      mode: null,
      modal: false,
      warning: false
    };
  }

  componentDidMount = () => {
    actions.getInterfaces();
    this.timer = setInterval(actions.getInterfaces, 10000);
  };

  componentWillUnmount = () => {
    clearInterval(this.timer);
  };

  setInterface = mode => {
    this.setState({ mode });

    let { interfaces } = this.props.state;
    let warning = mode !== "Mesh" && Object.values(interfaces).includes(mode);
    if (warning) return this.setState({ warning });

    this.setState({ modal: true });
  };

  confirm = () => {
    this.setState({ modal: false });

    actions.startPortChange();
    actions.startWaiting();

    let i = setInterval(async () => {
      actions.keepWaiting();
      if (getState().waiting <= 0) {
        clearInterval(i);
      }
    }, 1000);

    actions.setInterface(this.state.mode);
  };

  setPort = iface => {
    actions.setPort(iface);
    this.setState({ warning: false });
  };

  render() {
    let { t } = this.props;
    let {
      initializing,
      info,
      loadingInterfaces,
      interfaces,
      port
    } = this.props.state;
    let { mode, modal, warning } = this.state;
    let { device } = info;
    let modes = [t("LAN"), t("Mesh"), t("WAN")];

    if (!interfaces)
      if (loadingInterfaces === false) {
        return <Alert color="info">{t("noInterfaces")}</Alert>;
      } else
        return initializing ? (
          <Progress animated color="info" value={100} />
        ) : null;

    if (!device) return <Alert color="danger">{t("noDevice")}</Alert>;

    return (
      <div>
        <Confirm
          show={modal}
          t={t}
          cancel={() => this.setState({ modal: false })}
          confirm={this.confirm}
        />

        <Card>
          <CardBody>
            <h2 style={{ marginTop: 20 }}>{t("ports")}</h2>
            <p style={{ color: "gray", fontSize: 14 }}>
              Re-assign the modes of your router ports. They are visually
              displayed in the same order as on your router.
            </p>
            <div className="d-flex flex-wrap">
              {device === "gl-b1300" && (
                <div className="text-center">
                  <img
                    src={glImage}
                    alt="GL B-1300"
                    className="img-fluid"
                    style={{ marginBottom: 20, width: 300, marginRight: 40 }}
                  />
                </div>
              )}
              <Row
                className="d-flex flex-nowrap justify-content-center"
                style={{ marginBottom: 20 }}
              >
                {portOrderings[device].map((iface, i) => {
                  return (
                    <Card
                      className={port === iface ? "bg-primary" : null}
                      key={i}
                      style={{
                        borderRadius: 0,
                        borderLeft:
                          i === portOrderings[device].length - 1 && "none",
                        borderRight: i === 0 && "none"
                      }}
                    >
                      <CardBody className="text-center">
                        <img src={portImage} alt={iface} width="60px" />

                        <div
                          style={{
                            position: "absolute",
                            top: 30,
                            left: 62,
                            fontSize: 24,
                            fontWeight: "bold",
                            textShadow: "2px 2px #666",
                            textAlign: "center",
                            color: "white",
                            height: 40,
                            paddingTop: 4
                          }}
                        >
                          {iface}
                        </div>

                        {warning && (
                          <Alert color="danger">{t("onlyOne", { mode })}</Alert>
                        )}
                        <div className="d-flex flex-column mt-3">
                          {modes.map((mode, i) => {
                            return (
                              <Button
                                key={i}
                                style={{
                                  width: 100,
                                  background: "white",
                                  color: "#999",
                                  border: "1px solid #aaa",
                                  borderRadius: 0,
                                  marginTop: 6
                                }}
                                onClick={() => this.setInterface(mode)}
                              >
                                {mode}
                              </Button>
                            );
                          })}
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </Row>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default connect([
  "error",
  "initializing",
  "info",
  "loadingInterfaces",
  "port",
  "success",
  "interfaces"
])(withTranslation()(Ports));
