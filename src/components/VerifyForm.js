import React, { Component } from "react";
import {
  Card,
  CardBody,
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
    await actions.verifyExit(this.props.nickname, this.state.fields.code);
  };

  isFieldValid = name =>
    this.state.fields[name] ? this.state.valid[name] : undefined;

  render() {
    let { waiting } = this.state;

    return (
      <Card>
        <CardBody>
          {waiting ? (
            <div>
              Submitting Verification
              <Progress color="info" animated value="100" />
            </div>
          ) : (
            <Form onSubmit={this.onSubmit}>
              <FormGroup id="form">
                <Label for="email">Verification Code</Label>
                <Input
                  type="text"
                  name="code"
                  maxLength="6"
                  valid={this.isFieldValid("code")}
                  invalid={!this.isFieldValid("code")}
                  onChange={this.onFieldChange}
                  onBlur={this.onBlur}
                  value={this.state.fields.code || ""}
                />
                <FormFeedback invalid>
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
          )}
        </CardBody>
      </Card>
    );
  }
}

export default VerifyForm;
