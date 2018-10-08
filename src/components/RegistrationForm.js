import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Input,
  Progress
} from "reactstrap";
import { actions } from "../store";
import { translate } from "react-i18next";

const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blurred: false,
      fields: {
        email: ""
      },
      waiting: false,
      valid: {}
    };
    this.validators = {
      email: value => !!value.match(regex)
    };
    this.startRegistering = this.startRegistering.bind(this);
    this.stopRegistering = this.stopRegistering.bind(this);
  }

  componentDidMount = () => {
    this.setState({
      fields: {
        email: this.props.email
      }
    });
  };

  onFieldChange = e => {
    const { name, value } = e.target;

    this.setState({
      blurred: false,
      fields: {
        ...this.state.fields,
        [name]: value
      },
      valid: {
        ...this.state.valid,
        [name]: true
      }
    });
  };

  onBlur = e => {
    const { name, value } = e.target;

    this.setState({
      blurred: true,
      valid: {
        ...this.state.valid,
        [name]: this.validators[name](value)
      }
    });
  };

  onSubmit = async e => {
    e.preventDefault();

    this.setState({ waiting: true });
    actions.registerExit(this.props.nickname, this.state.fields.email);
  };

  isFieldValid = name =>
    this.state.fields[name] ? this.state.valid[name] : false;

  startRegistering() {
    this.props.startRegistering();
    this.setState({ registering: true });
  }

  stopRegistering() {
    this.props.stopRegistering();
    this.setState({ registering: false, waiting: false });
  }

  render() {
    let { registering, waiting } = this.state;
    let { t } = this.props;

    return waiting ? (
      <Card>
        <CardBody>
          <div>
            <h5>{t("register")}</h5>
            <Progress color="success" animated value="50" />
            <p style={{ marginTop: 10 }} className="text-center">
              <b>{t("submittingEmail")}</b>
            </p>
          </div>
        </CardBody>
      </Card>
    ) : registering ? (
      <Card>
        <CardBody>
          <Form onSubmit={this.onSubmit} className="form-inline">
            <h5>{t("register")}</h5>
            <FormGroup id="form">
              <Label for="email" style={{ marginRight: 5 }}>
                <b>{t("email")}</b>
              </Label>
              <Input
                label={t("email")}
                type="email"
                name="email"
                placeholder={t("enterEmail")}
                valid={this.isFieldValid("email") && this.state.blurred}
                invalid={
                  !(this.isFieldValid("email") || !this.state.fields.email)
                }
                onChange={this.onFieldChange}
                onBlur={this.onBlur}
                value={this.state.fields.email || ""}
              />
              <FormFeedback invalid="true">{t("emailRequired")}</FormFeedback>
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
                color={this.isFieldValid("email") ? "primary" : "secondary"}
                disabled={!this.isFieldValid("email") || waiting}
                style={{
                  margin: 3
                }}
              >
                {t("submit")}
              </Button>
              <Button
                color="primary"
                style={{ margin: 3 }}
                onClick={this.stopRegistering}
              >
                {t("cancel")}
              </Button>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    ) : (
      <Button
        color="primary"
        className="float-lg-right"
        onClick={this.startRegistering}
        style={{
          margin: 10
        }}
      >
        {t("register")}
      </Button>
    );
  }
}

export default translate()(RegistrationForm);
