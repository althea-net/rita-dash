import React, { Component } from "react";
import {
  Alert,
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Input,
  Progress
} from "reactstrap";
import { actions } from "../store";

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

  onSubmit = async e => {
    e.preventDefault();

    this.setState({ waiting: true });
    setTimeout(() => this.setState({ timeout: true, waiting: false }), 15000);
    await actions.verifyExit(this.props.nickname, this.state.fields.code);
  };

  isFieldValid = name =>
    this.state.fields[name] ? this.state.valid[name] : false;

  render() {
    let { timeout, waiting } = this.state;

    return waiting ? (
      <div>
        <Progress color="success" animated value="50" />
        <p style={{ marginTop: 10 }} className="text-center">
          <b>Submitting verification code to exit...</b>
        </p>
      </div>
    ) : (
      <Form onSubmit={this.onSubmit} className="form-inline">
        <h5>Register</h5>
        {timeout ? (
          <Alert color="warning">
            Registration timed out possibly due to an invalid code
          </Alert>
        ) : (
          <p>
            A six-digit registration code is being sent to your email address.
          </p>
        )}
        <FormGroup id="form" className="form-inline">
          <Label for="code" style={{ marginRight: 5 }}>
            <b>Code</b>
          </Label>
          <Input
            type="text"
            name="code"
            placeholder="Enter 6 digit code"
            maxLength="6"
            valid={this.isFieldValid("code")}
            invalid={!(this.isFieldValid("code") || !this.state.fields.code)}
            onChange={this.onFieldChange}
            onBlur={this.onBlur}
            value={this.state.fields.code || ""}
          />
          <FormFeedback invalid="true">
            Please enter a valid 6-digit code
          </FormFeedback>
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
            Verify
          </Button>
        </FormGroup>
      </Form>
    );
  }
}

export default VerifyForm;
