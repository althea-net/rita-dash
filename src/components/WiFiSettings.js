import React, { Component } from "react";
import {
  Col,
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

class AdvancedSettingsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      network: this.props.network
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    })
  }

  render() {
    return (
      <div>
        <Button
          color="link"
          onClick={this.toggle}
          style={{
            margin: 10
          }}
        >
          Advanced Settings
          </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.state.network} Bandwidth: WiFi Settings</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <h5>Connect to a Mesh Network</h5>
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="enableMesh" />{' '}
                    Enable Connection
                </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="enableMesh" />{' '}
                    Disable Connection
                </Label>
                </FormGroup>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}


export default class WiFiSettings extends Component {
  render() {
    return (
      <div>
        <h1>WiFi Settings</h1>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: 10,
            margin: -20
          }}
        >
          <WifiSettingsForm network="2.4 GHz" />
          <WifiSettingsForm network="5 GHz" />
        </div>
      </div>
    );
  }
}

function WifiSettingsForm({ network }) {
  return (
    <Card style={{ flex: 1, minWidth: 300, margin: 10 }}>
      <CardBody>
        <Form>
          <Label
            for="form"
            style={{
              marginBottom: "20px",
              fontSize: "1.5em",
              textAlign: "center"
            }}
          >
            {network} Bandwidth
          </Label>

          <FormGroup id="form">
            <Label for="form-input">SSID</Label>
            <Input
              type="text"
              name="form-input"
              id="form-input"
              placeholder="min. 8 characters"
            />
          </FormGroup>
          <FormGroup>
            <Label for="password-input">Password</Label>
            <Input
              type="password"
              name="password-input"
              id="password-input"
              placeholder="min. 8 characters"
            />
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
              color="primary"
              style={{
                margin: 10
              }}
            >
              Save
            </Button>
            <AdvancedSettingsModal network={network} />
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
}
