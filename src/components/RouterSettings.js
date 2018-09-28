import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Button,
  Progress
} from "reactstrap";
import { actions, connect } from "../store";
import "./RouterSettings.css";
import Error from "./Error";
import WifiSettingsForm from "./WifiSettingsForm";
import { translate } from "react-i18next";
import port1 from "../images/port1.png";
import port2 from "../images/port2.png";
import port3 from "../images/port3.png";

class RouterSettings extends Component {
  componentDidMount() {
    actions.getWifiSettings();
  }

  render() {
    const { error, loading, wifiSettings } = this.props.state;
    const { t } = this.props;

    return (
      <div>
        <h1>{t("routerSettings")}</h1>

        {error ? (
          <Error error={error} />
        ) : (
          loading && <Progress animated color="info" value="100" />
        )}
        <h2>Wifi</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: 10,
            margin: -20
          }}
        >
          {!error &&
            wifiSettings &&
            wifiSettings.map((settings, i) => (
              <WifiSettingsForm
                state={this.props.state}
                key={i}
                wifiSettings={settings}
              />
            ))}
        </div>
        <h2 style={{ marginTop: 20 }}>Ports</h2>
        <Row
          className="d-flex justify-content-center"
          style={{ marginBottom: 20 }}
        >
          <Card>
            <CardBody>
              <img src={port1} alt="Port 1" width="60px" />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <img src={port2} alt="Port 2" width="60px" />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <img src={port3} alt="Port 3" width="60px" />
            </CardBody>
          </Card>
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

export default connect(["error", "loading", "success", "wifiSettings"])(
  translate()(RouterSettings)
);
