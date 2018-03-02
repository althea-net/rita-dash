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
          color="primary"
          onClick={this.toggle}
          style={{
            margin: 10
          }}
        >
          Advanced Settings</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.state.network} Band: WiFi Settings</ModalHeader>
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </ModalBody>
          <Button color="primary" onClick={this.toggle}>Close</Button>
        </Modal>
      </div >
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
            {network}
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
