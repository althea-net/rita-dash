import React from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress,
  Row
} from "reactstrap";
import { connect, actions } from "../store";
import { translate } from "react-i18next";
import portImage from "../images/port.png";
import portOrderings from "../portOrderings";

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
    this.timer = setInterval(actions.getInterfaces, 5000);
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

  render() {
    let { t } = this.props;
    let {
      firstLoad,
      info,
      loadingInterfaces,
      interfaces,
      port
    } = this.props.state;
    let { mode, modal, warning } = this.state;
    let { device } = info;
    let modes = [t("Mesh"), t("WAN"), t("LAN")];

    if (!interfaces)
      if (loadingInterfaces !== null && !loadingInterfaces) {
        return <Alert color="info">{t("noInterfaces")}</Alert>;
      } else
        return firstLoad ? (
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

const Confirm = ({ cancel, confirm, show, t }) => (
  <div>
    <Modal isOpen={show} centered>
      <ModalHeader>{t("Are you sure?")}</ModalHeader>
      <ModalBody>
        <Alert color="warning">
          This action will interrupt the connection to the router and require
          this page to be refreshed.
        </Alert>
        <p>Do you wish to proceed?</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={confirm}>
          Yes
        </Button>
        <Button color="secondary" onClick={cancel}>
          No
        </Button>
      </ModalFooter>
    </Modal>
  </div>
);

export default connect([
  "error",
  "firstLoad",
  "info",
  "loadingInterfaces",
  "port",
  "success",
  "interfaces"
])(translate()(Ports));
