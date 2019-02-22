import React, { Component } from "react";
import {
  Alert,
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
import animatedScrollTo from "animated-scroll-to";
import { withTranslation } from "react-i18next";

class VerifyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blurred: false,
      fields: {
        code: ""
      },
      timeout: false,
      waiting: false,
      valid: {}
    };
    this.validators = {
      code: s => Math.floor(Number(s)) !== Infinity && s.length === 6
    };
  }

  componentDidMount = () => {
    this.setState({
      fields: {
        code: this.props.code
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

  onSubmit = e => {
    e.preventDefault();
    this.setState({ waiting: true });

    setTimeout(() => {
      this.setState({ timeout: true, waiting: false });
    }, 5000);

    actions.verifyExit(this.props.nickname, this.state.fields.code);
    animatedScrollTo(0);
  };

  isFieldValid = name =>
    this.state.fields[name] ? this.state.valid[name] : false;

  render() {
    let { timeout, waiting } = this.state;
    let { id, t } = this.props;

    return (
      <Card>
        <CardBody>
          {waiting ? (
            <div>
              <h5>Register</h5>
              <Progress color="success" animated value="50" />
              <p style={{ marginTop: 10 }} className="text-center">
                <b>{t("submittingCode")}</b>
              </p>
            </div>
          ) : (
            <Form onSubmit={this.onSubmit} className="form-inline">
              <h5>Register</h5>
              {timeout ? (
                <Alert color="warning">{t("registrationTimeout")}</Alert>
              ) : (
                <p>{t("codeSent")}</p>
              )}
              <FormGroup id="form" className="form-inline">
                <Label for="code" style={{ marginRight: 5 }}>
                  <b>{t("code")}</b>
                </Label>
                <Input
                  id={id + "-code"}
                  type="text"
                  name="code"
                  placeholder="Enter 6 digit code"
                  maxLength="6"
                  valid={this.isFieldValid("code")}
                  invalid={
                    !(this.isFieldValid("code") || !this.state.fields.code)
                  }
                  onChange={this.onFieldChange}
                  onBlur={this.onBlur}
                  value={this.state.fields.code || ""}
                />
                <FormFeedback invalid="true">{t("enterCode")}</FormFeedback>
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
                  color={this.isFieldValid("code") ? "primary" : "secondary"}
                  disabled={!this.isFieldValid("code")}
                  style={{
                    margin: 10
                  }}
                >
                  {t("verify")}
                </Button>
              </FormGroup>
            </Form>
          )}
        </CardBody>
      </Card>
    );
  }
}

export default withTranslation()(VerifyForm);
