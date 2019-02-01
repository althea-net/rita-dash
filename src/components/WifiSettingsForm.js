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
import { actions, connect } from "../store";
import { translate } from "react-i18next";

class WifiSettingsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        key: "",
        ssid: "",
        channel: "",
        device: {
          sectionName: ""
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
    console.log(this.props.wifiSettings);
    this.setState({
      fields: {
        ...this.props.wifiSettings,
        channel: this.props.wifiSettings.device.channel
      }
    });
  };

  onFieldChange = e => {
    const { name, value } = e.target;

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
      <React.Fragment>
        <Card style={{ flex: 1, minWidth: 300, margin: 10 }}>
          <CardBody>
            {success === radioType && (
              <Alert color="success">{t("settingsSaved")}</Alert>
            )}
            {loadingWifi === radioType && (
              <Progress animated color="info" value="100" />
            )}
            <Form onSubmit={this.onSubmit}>
              <Label
                for="form"
                style={{
                  marginBottom: "20px",
                  fontSize: "1.5em",
                  textAlign: "center"
                }}
              >
                {radioType}
              </Label>

              <FormGroup id="form">
                <Label for="ssid">{t("ssid")}</Label>
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
              <FormGroup>
                <Label for="password">{t("password")}</Label>
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
              <FormGroup>
                <Label for="channel">{t("channel")}</Label>
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

              <FormGroup
                style={{
                  display: "flex",
                  margin: -20,
                  marginTop: 0,
                  padding: 10
                }}
              >
                <Button
                  id={radioType + "-submit"}
                  color="primary"
                  style={{
                    margin: 10
                  }}
                >
                  {t("save")}
                </Button>
              </FormGroup>

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
      </React.Fragment>
    );
  }
}

export default connect(["loadingWifi", "success", "channels"])(
  translate()(WifiSettingsForm)
);
