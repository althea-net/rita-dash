import React, { Component } from "react";
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Input,
  Progress
} from "reactstrap";
import { actions } from "../store";

const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blurred: false,
      fields: {
        email: ""
      },
      registering: false,
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
    this.state.fields[name] ? this.state.valid[name] : undefined;

  startRegistering() {
    this.setState({ registering: true });
  }

  stopRegistering() {
    this.setState({ registering: false, waiting: false });
  }

  render() {
    let { registering, waiting } = this.state;

    return waiting ? (
      <div>
        Submitting Registration Request
        <Progress color="info" animated value="100" />
      </div>
    ) : registering ? (
      <Form onSubmit={this.onSubmit}>
        <FormGroup id="form">
          <Label for="email">Email</Label>
          <Input
            type="email"
            name="email"
            valid={this.isFieldValid("email") && this.state.blurred}
            invalid={!this.isFieldValid("email") && this.state.fields.email}
            onChange={this.onFieldChange}
            onBlur={this.onBlur}
            value={this.state.fields.email || ""}
          />
          <FormFeedback invalid>A valid email is required</FormFeedback>
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
              margin: 10
            }}
          >
            Submit
          </Button>
          <Button style={{ margin: 10 }} onClick={this.stopRegistering}>
            Cancel
          </Button>
        </FormGroup>
      </Form>
    ) : (
      <Button
        color="primary"
        className="float-lg-right"
        onClick={this.startRegistering}
        style={{
          margin: 10
        }}
      >
        Register
      </Button>
    );
  }
}

export default RegistrationForm;
