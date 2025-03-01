import React, { useEffect, useState } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { Tooltip } from "react-tooltip";
import { post } from "store";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Confirm } from "utils";
import { Divider, Snackbar } from "@material-ui/core";

export const ExitModeButton = styled(Button)`
  width: 32%;
  background: ${(props) => (props.selected ? "#0BB36D" : "white")} !important;
  color: ${(props) => (props.selected ? "white" : "gray")} !important;
  border: 1px solid #aaa;
  border-color: ${(props) => (props.selected ? "#0BB36D" : "#aaa")} !important;
  border-radius: 40%;
  margin-top: 6px;
  font-weight: normal !important;
  font-size: 20px !important;
  padding: 0.5rem 0.7rem !important;
  white-space: wrap;
`;

const ExitMode = ({ exitInfo }) => {
  const [t] = useTranslation();
  const [confirming, setConfirming] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [staticAssignments, setStaticAssignments] = useState([]);
  const [originalStaticAssignments, setOriginalStaticAssignments] = useState(
    []
  );
  const [newStaticAssignments, setNewStaticAssignments] = useState([]);
  const [modeSetting, setModeSetting] = useState(0);
  const [subnet, setSubnet] = useState("");
  const [gateway, setGateway] = useState("");
  const [externalIp, setExternalIp] = useState("");
  const [broadcastIp, setBroadcastIp] = useState("");

  const modes = ["MASQUERADENAT", "CGNAT", "SNAT"];

  const tooltipExplanations = [
    "Default Masquerade Nat mode. All clients will be sent out through the exit IP.",
    "CGNAT mode. Clients will be randomly allocated between available ips, with the potential for multiple clients to route through the same ip.",
    "SNAT mode. All clients will receive an exclusive ip from the available ips.",
  ];

  useEffect(() => {
    if (exitInfo) {
      console.log("Exit info:", exitInfo);
      let mode;
      let info_inner;
      if (typeof exitInfo.ipv4Routing === "string") {
        mode = exitInfo.ipv4Routing.toUpperCase();
      } else if (typeof exitInfo.ipv4Routing === "object") {
        if (exitInfo.ipv4Routing.hasOwnProperty("cgnat")) {
          mode = "CGNAT";
          info_inner = exitInfo.ipv4Routing.cgnat;
        } else if (exitInfo.ipv4Routing.hasOwnProperty("snat")) {
          mode = "SNAT";
          info_inner = exitInfo.ipv4Routing.snat;
        } else {
          showSnackbar("Error: Unknown exit mode");
        }
      }
      setModeSetting(modes.indexOf(mode));
      if (info_inner) {
        setSubnet(info_inner.subnet || "");
        setGateway(info_inner.gatewayIpv4 || "");
        setExternalIp(info_inner.externalIpv4 || "");
        setBroadcastIp(info_inner.broadcastIpv4 || "");
        setStaticAssignments(info_inner.staticAssignments || []);
        setOriginalStaticAssignments(info_inner.staticAssignments || []);
        console.log(info_inner.staticAssignments);
      } else {
        setSubnet("");
        setGateway("");
        setExternalIp("");
        setBroadcastIp("");
        setStaticAssignments([]);
        setOriginalStaticAssignments([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exitInfo]);

  let handleSave = async (e) => {
    e.preventDefault();
    setConfirming(true);
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 5000);
  };

  async function submit() {
    if (modeSetting !== 0) {
      // Check if the mode is not MASQUERADENAT
      const subnetRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
      if (!subnetRegex.test(subnet)) {
        showSnackbar("Subnet must include a valid subnet and mask");
        setConfirming(false);
        return;
      } else if (subnet.endsWith("/32")) {
        showSnackbar("Subnet mask is too small");
        setConfirming(false);
        return;
      }

      for (let assignment of newStaticAssignments) {
        if (
          !assignment.mesh_ip ||
          !assignment.eth_address ||
          !assignment.wg_public_key
        ) {
          showSnackbar("Cannot save unfinished static assignment!");
          setConfirming(false);
          return;
        }
      }
    }

    let currentStaticAssignments = originalStaticAssignments.map(
      (assignment) => ({
        mesh_ip: assignment.clientId.meshIp,
        eth_address: assignment.clientId.ethAddress,
        wg_public_key: assignment.clientId.wgPublicKey,
      })
    );
    const payload = {
      mode: modes[modeSetting].toUpperCase(),
      subnet,
      gateway,
      external_ip: externalIp,
      broadcast_ip: broadcastIp,
      static_assignments: [
        ...currentStaticAssignments,
        ...newStaticAssignments,
      ].map((assignment) => ({
        mesh_ip: assignment.mesh_ip,
        eth_address: assignment.eth_address,
        wg_public_key: assignment.wg_public_key,
      })),
    };

    try {
      const response = await post(`/set_exit_network`, payload);
      if (response instanceof Error) {
        if (response.message) {
          showSnackbar("Error: " + response.message);
        } else {
          showSnackbar(
            "Incorrect or incomplete network settings, cannot get next ip"
          );
        }
      }
    } catch (e) {
      if (e.message.includes("400")) {
        showSnackbar("Invalid or incomplete network settings");
      } else if (e.message.includes("500")) {
        showSnackbar("Could not add static assignment, possibly out of ips?");
      } else {
        showSnackbar(`Error: ${e.message}`);
      }
      console.log(e.message);
      console.log(e.response);
      console.log(e.body);
      console.log(JSON.stringify(e));
    }

    setConfirming(false);
  }

  async function fetchNextStaticIp() {
    // Check if the mode is not MASQUERADENAT
    const subnetRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
    if (!subnetRegex.test(subnet)) {
      showSnackbar("Subnet must include a valid subnet and mask");
      setConfirming(false);
      return;
    } else if (subnet.endsWith("/32")) {
      showSnackbar("Subnet mask is too small");
      setConfirming(false);
      return;
    }
    let currentStaticAssignments = originalStaticAssignments.map(
      (assignment) => ({
        mesh_ip: assignment.clientId.meshIp,
        eth_address: assignment.clientId.ethAddress,
        wg_public_key: assignment.clientId.wgPublicKey,
      })
    );
    const payload = {
      mode: modes[modeSetting].toUpperCase(),
      subnet,
      gateway,
      external_ip: externalIp,
      broadcast_ip: broadcastIp,
      static_assignments: [...currentStaticAssignments, ...newStaticAssignments]
        .filter((assignment) => assignment) // Filter out undefined assignments
        .map((assignment) => ({
          mesh_ip: assignment.mesh_ip,
          eth_address: assignment.eth_address,
          wg_public_key: assignment.wg_public_key,
        })),
    };
    console.log("Current static assignments:", payload.static_assignments);
    console.log("static assignments:", currentStaticAssignments);
    console.log("new static assignments:", newStaticAssignments);
    try {
      const response = await post(`/get_next_static_ip`, payload);
      console.log("status:", response.status);
      if (!(response instanceof Error)) {
        setNewStaticAssignments([
          ...newStaticAssignments,
          { ip: response, mesh_ip: "", eth_address: "", wg_public_key: "" },
        ]);
      } else {
        if (response.message) {
          showSnackbar("Error: " + response.message);
        } else {
          showSnackbar(`Error: could not get the next ip`);
        }
      }
    } catch (e) {
      if (e.message.includes("400")) {
        showSnackbar("Invalid or incomplete network settings");
      } else if (e.message.includes("500")) {
        showSnackbar("Could not add static assignment, possibly out of ips?");
      } else {
        showSnackbar(`Error: ${e.message}`);
      }
    }
  }

  function checkModeSetting() {
    switch (modeSetting) {
      case 0:
        return "MASQUERADENAT";
      case 1:
        return "CGNAT";
      default:
        return "SNAT";
    }
  }

  let cancel = () => setConfirming(false);

  const handleModeChange = (index) => {
    setModeSetting(index);
    setStaticAssignments([]); // Reset assignments list
  };

  const handleStaticAssignmentChange = (index, field, value) => {
    const updatedAssignments = [...newStaticAssignments];
    updatedAssignments[index][field] = value;
    setNewStaticAssignments(updatedAssignments);
  };

  const handleDeleteAssignment = (index) => {
    const updatedAssignments = [...staticAssignments];
    updatedAssignments.splice(index, 1);
    setStaticAssignments(updatedAssignments);
    setOriginalStaticAssignments(updatedAssignments);
  };

  const handleDeleteNewAssignment = (index) => {
    const updatedAssignments = [...newStaticAssignments];
    updatedAssignments.splice(index, 1);
    setNewStaticAssignments(updatedAssignments);
  };

  return (
    <>
      <Confirm
        open={confirming}
        setOpen={setConfirming}
        confirm={submit}
        cancel={cancel}
        message="Changing exit mode settings will trigger a reboot which will interrupt internet connection."
      />

      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
      />

      <div className="flex-wrap flex-md-wrap w-100" style={{ marginTop: 10 }}>
        <div className="my-auto" style={{ color: "gray", textAlign: "center" }}>
          {modes.map((mode, i) => {
            let currentSetting = checkModeSetting();

            let selected = mode === currentSetting;

            return (
              <>
                <ExitModeButton
                  key={i}
                  selected={selected}
                  onClick={() => handleModeChange(i)}
                  readOnly={selected}
                  className={"active" + i}
                >
                  {mode}
                </ExitModeButton>

                <Tooltip anchorSelect={".active" + i}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: 250,
                    }}
                  >
                    {tooltipExplanations[i]}
                  </div>
                </Tooltip>
              </>
            );
          })}
        </div>
        <div className="w-100" style={{ marginTop: 20 }}>
          {(modeSetting === 1 || modeSetting === 2) && (
            <>
              <Label>
                Network Settings
                <Tooltip anchorSelect="#networkSettingsTooltip">
                  <div style={{ width: 250 }}>
                    These settings are required for the exit node to function
                    properly. For CGNAT, gateway and external ip must be the
                    first two ips, and broadcast ip must be the last ip in the
                    subnet.
                  </div>
                </Tooltip>
                <span
                  id="networkSettingsTooltip"
                  style={{ marginLeft: 5, cursor: "pointer" }}
                >
                  ℹ️
                </span>
              </Label>
              <div style={{ display: "flex", gap: "10px" }}>
                <FormGroup style={{ flex: 1 }}>
                  <Label for="subnet">Subnet:</Label>
                  <Input
                    type="text"
                    name="subnet"
                    id="subnet"
                    value={subnet}
                    onChange={(e) => setSubnet(e.target.value)}
                  />
                </FormGroup>
                <FormGroup style={{ flex: 1 }}>
                  <Label for="gateway">Gateway:</Label>
                  <Input
                    type="text"
                    name="gateway"
                    id="gateway"
                    value={gateway}
                    onChange={(e) => setGateway(e.target.value)}
                  />
                </FormGroup>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <FormGroup style={{ flex: 1 }}>
                  <Label for="externalIp">External IP:</Label>
                  <Input
                    type="text"
                    name="externalIp"
                    id="externalIp"
                    value={externalIp}
                    onChange={(e) => setExternalIp(e.target.value)}
                  />
                </FormGroup>
                <FormGroup style={{ flex: 1 }}>
                  <Label for="broadcastIp">Broadcast IP:</Label>
                  <Input
                    type="text"
                    name="broadcastIp"
                    id="broadcastIp"
                    value={broadcastIp}
                    onChange={(e) => setBroadcastIp(e.target.value)}
                  />
                </FormGroup>
              </div>
              <Label>
                Current Static Assignments
                <Tooltip anchorSelect="#staticAssignmentsTooltip">
                  <div style={{ width: 250 }}>
                    Deleting static assignments may shuffle ips to remaining
                    assignments
                  </div>
                </Tooltip>
                <span
                  id="staticAssignmentsTooltip"
                  style={{ marginLeft: 5, cursor: "pointer" }}
                >
                  ℹ️
                </span>
              </Label>
              {originalStaticAssignments.map((assignment, index) => (
                <FormGroup
                  key={index}
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Input
                    type="text"
                    name={`staticAssignment-${index}`}
                    id={`staticAssignment-${index}`}
                    value={`${assignment.clientExternalIp}:   ${assignment.clientId.wgPublicKey}`}
                    readOnly
                    style={{ flex: 1 }}
                  />
                  <Button
                    color="danger"
                    onClick={() => handleDeleteAssignment(index)}
                    style={{ marginLeft: 10 }}
                  >
                    Delete
                  </Button>
                </FormGroup>
              ))}
              {newStaticAssignments.map((assignment, index) => (
                <>
                  <Divider />
                  <div
                    style={{
                      color: "gray",
                      textAlign: "center",
                      paddingTop: 20,
                    }}
                  >
                    <h6>New Static Assignment</h6>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <FormGroup key={index} style={{ flex: 1 }}>
                      <Label for={`ip-${index}`}>Static Ip:</Label>
                      <Input
                        type="text"
                        name={`ip-${index}`}
                        id={`ip-${index}`}
                        value={assignment.ip}
                        readOnly
                      />
                    </FormGroup>

                    <FormGroup style={{ flex: 1 }}>
                      <Label for={`meshIp-${index}`}>Mesh IP:</Label>
                      <Input
                        type="text"
                        name={`meshIp-${index}`}
                        id={`meshIp-${index}`}
                        value={assignment.mesh_ip}
                        onChange={(e) =>
                          handleStaticAssignmentChange(
                            index,
                            "mesh_ip",
                            e.target.value
                          )
                        }
                      />
                    </FormGroup>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <FormGroup style={{ flex: 1 }}>
                      <Label for={`ethAddress-${index}`}>
                        Payment Address:
                      </Label>
                      <Input
                        type="text"
                        name={`ethAddress-${index}`}
                        id={`ethAddress-${index}`}
                        value={assignment.eth_address}
                        onChange={(e) =>
                          handleStaticAssignmentChange(
                            index,
                            "eth_address",
                            e.target.value
                          )
                        }
                      />
                    </FormGroup>
                    <FormGroup style={{ flex: 1 }}>
                      <Label for={`wgPublicKey-${index}`}>WG Key:</Label>
                      <Input
                        type="text"
                        name={`wgPublicKey-${index}`}
                        id={`wgPublicKey-${index}`}
                        value={assignment.wg_public_key}
                        onChange={(e) =>
                          handleStaticAssignmentChange(
                            index,
                            "wg_public_key",
                            e.target.value
                          )
                        }
                      />
                    </FormGroup>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: 10,
                    }}
                  >
                    <Button
                      color="danger"
                      onClick={() => handleDeleteNewAssignment(index)}
                    >
                      Delete
                    </Button>
                  </div>
                  <Divider />
                </>
              ))}

              <div
                className="my-auto"
                style={{ color: "gray", textAlign: "center", paddingTop: 20 }}
              >
                <Button onClick={fetchNextStaticIp} color="secondary">
                  New Static Assignment
                </Button>
              </div>
            </>
          )}
        </div>
        <div
          className="my-auto"
          style={{ color: "gray", textAlign: "center", paddingTop: 20 }}
        >
          <p>
            <Button onClick={(e) => handleSave(e)} color="primary">
              {t("save")}
            </Button>
          </p>
        </div>
      </div>
    </>
  );
};

export default ExitMode;
