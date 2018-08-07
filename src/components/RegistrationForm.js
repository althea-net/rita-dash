import React, { Component } from "react";
import {
  Card,
  CardBody,
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Input
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
      valid: {}
    };
    this.validators = {
      email: value => !!value.match(regex)
    };
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

    await actions.registerExit(this.props.nickname, this.state.fields.email);
  };

  isFieldValid = name =>
    this.state.fields[name] ? this.state.valid[name] : undefined;

  render() {
    return (
      <Card>
        <CardBody>
          <Form onSubmit={this.onSubmit}>
            <FormGroup id="form">
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                valid={this.isFieldValid("email") && this.state.blurred}
                invalid={this.state.email && !this.isFieldValid("email")}
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
                disabled={!this.isFieldValid("email")}
                style={{
                  margin: 10
                }}
              >
                Register
              </Button>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

export default RegistrationForm;
