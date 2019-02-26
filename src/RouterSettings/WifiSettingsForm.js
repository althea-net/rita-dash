import React, { Component } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  Progress
} from "reactstrap";
import { actions, connect, getState } from "store";
import { withTranslation } from "react-i18next";

class WifiSettingsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        key: "",
        ssid: "",
        channel: "",
        device: {
          sectionName: "",
          channel: ""
        }
      },
      valid: {}
    };
    this.validators = {
      ssid: value => value.length >= 8,
      key: value => value.length >= 8,
      channel: value => !isNaN(value)
    };
  }

  componentDidMount = () => {
    this.setState({
      fields: {
        ...this.props.wifiSettings,
        channel: this.props.wifiSettings.device.channel
      }
    });
  };

  onFieldChange = e => {
    const { name, value } = e.target;
    if (name === "channel") {
      this.setState({
        fields: {
          device: { channel: value }
        }
      });
    }

    this.setState({
      fields: {
        ...this.state.fields,
        [name]: value
      },
      valid: {
        ...this.state.valid,
        [name]: this.validators[name](value)
      }
    });
  };

  onSubmit = e => {
    e.preventDefault();

    if (
      this.state.fields.key !== this.props.wifiSettings.key ||
      this.state.fields.ssid !== this.props.wifiSettings.ssid
    ) {
      actions.startWaiting();

      let i = setInterval(async () => {
        actions.keepWaiting();
        if (getState().waiting <= 0) {
          clearInterval(i);
        }
      }, 1000);
    }

    actions.saveWifiSetting(
      this.state.fields,
      this.props.wifiSettings.device.radioType
    );
  };

  isFieldValid = name =>
    this.state.fields[name] ? this.state.valid[name] : undefined;

  render() {
    let radioType = this.props.wifiSettings.device.radioType;
    let radio = this.props.wifiSettings.device.sectionName;
    let { loadingWifi, success, channels } = this.props.state;
    let { t } = this.props;

    return (
      <>
        <Card style={{ marginBottom: 20 }}>
          <CardBody>
            {success === radioType && (
              <Alert color="success">{t("settingsSaved")}</Alert>
            )}
            {loadingWifi === radioType && (
              <Progress animated color="info" value="100" />
            )}
            <h4 className="mb-4">{t(radioType)}</h4>
            <Form onSubmit={this.onSubmit} className="d-flex flex-wrap">
              <FormGroup id="form" className="pr-2 mb-0">
                <Label for="ssid">
                  <b>{t("ssid")}</b>
                </Label>
                <Input
                  type="text"
                  id={radioType + "-ssid"}
                  name="ssid"
                  valid={this.isFieldValid("ssid")}
                  placeholder="min. 8 characters"
                  onChange={this.onFieldChange}
                  value={this.state.fields.ssid}
                />
              </FormGroup>
              <FormGroup className="pr-2 mb-0">
                <Label for="password">
                  <b>{t("networkPassword")}</b>
                </Label>
                <Input
                  type="text"
                  id={radioType + "-pass"}
                  name="key"
                  valid={this.isFieldValid("key")}
                  placeholder="min. 8 characters"
                  onChange={this.onFieldChange}
                  value={this.state.fields.key}
                />
              </FormGroup>
              <FormGroup className="pr-2 mb-0">
                <Label for="channel">
                  <b>{t("channel")}</b>
                </Label>
                <Input
                  type="select"
                  id={radio + "-channel"}
                  name="channel"
                  valid={this.isFieldValid("channel")}
                  onChange={this.onFieldChange}
                  value={this.state.fields.channel}
                >
                  {channels[radio] &&
                    channels[radio].map(c => <option key={c}>{c}</option>)}
                </Input>
              </FormGroup>

              <div className="mt-auto">
                <Button
                  id={radioType + "-submit"}
                  color="primary"
                  className="mt-2"
                >
                  {t("save")}
                </Button>
              </div>

              <FormGroup
                style={{
                  display: "flex",
                  margin: -20,
                  marginTop: 0,
                  padding: 10
                }}
              />
            </Form>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default connect(["loadingWifi", "success", "channels"])(
  withTranslation()(WifiSettingsForm)
);
