import React from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Progress,
  Row
} from "reactstrap";
import { connect, actions, getState } from "../store";
import { translate } from "react-i18next";
import portImage from "../images/port.png";
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
    let warning =
      mode !== "Mesh" &&
      Object.values(interfaces)
        .filter(i => !i.startsWith("wlan"))
        .includes(mode);
    if (warning) return this.setState({ warning });

    this.setState({ modal: true });
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
    let modes = [t("Mesh"), t("WAN"), t("LAN")];

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
          confirm={() => {
            actions.startWaiting();

            let i = setInterval(async () => {
              actions.keepWaiting();
              if (getState().waiting <= 0) {
                clearInterval(i);
              }
            }, 1000);

            actions.setInterface(this.state.mode);
            this.setState({ modal: false });
          }}
        />
        <h2 style={{ marginTop: 20 }}>{t("ports")}</h2>
        <Row
          className="d-flex justify-content-center"
          style={{ marginBottom: 20 }}
        >
          {portOrderings[device].map((iface, i) => {
            return (
              <Card
                style={{ cursor: "pointer" }}
                onClick={() => {
                  actions.setPort(iface);
                  this.setState({ warning: false });
                }}
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
                {warning && (
                  <Alert color="danger">{t("onlyOne", { mode })}</Alert>
                )}
                <p>
                  {t("mode")}: <strong>{interfaces[port]}</strong>
                </p>
                <p>{t("switchMode")}:</p>

                {modes.map((mode, i) => {
                  return (
                    <Button
                      color={
                        mode === interfaces[port] ? "secondary" : "primary"
                      }
                      key={i}
                      style={{ marginRight: 15 }}
                      disabled={mode === interfaces[port]}
                      onClick={() => this.setInterface(mode)}
                    >
                      {mode} {mode === "WAN" && t("gateway")}
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

export default connect([
  "error",
  "initializing",
  "info",
  "loadingInterfaces",
  "port",
  "success",
  "interfaces"
])(translate()(Ports));
