import React, { Component } from "react";
import { actions, connect } from "../store";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress
} from "reactstrap";
import { translate } from "react-i18next";

class AdvancedSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      mesh: props.mesh
    };

    this.toggle = this.toggle.bind(this);
    this.onToggleWifiMesh = this.onToggleWifiMesh.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  onToggleWifiMesh() {
    let mesh = !this.state.mesh;
    this.setState({ mesh });
    actions.toggleWifiMesh(this.props.radio, mesh);
  }

  render() {
    let { loading } = this.props.state;
    let { t } = this.props;

    return (
      <div>
        <Button
          color="link"
          onClick={this.toggle}
          style={{
            padding: 0,
            margin: 10
          }}
        >
          {t("advancedSettings")}
        </Button>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>
            {this.props.radio} {t("wifiSettings")}
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      onChange={this.onToggleWifiMesh}
                      value={this.state.mesh}
                      checked={this.state.mesh}
                    />{" "}
                    {t("enableMesh")}
                  </Label>
                </FormGroup>
              </FormGroup>
              {loading && <Progress color="info" value="100" animated />}
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              style={{
                margin: 10
              }}
              onClick={this.toggle}
            >
              {t("close")}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default connect(["loading"])(translate()(AdvancedSettings));
