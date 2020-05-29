import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../ui";
import { Button, Input, InputGroup } from "reactstrap";
import { get, post } from "store";
import PhoneInput from "react-phone-number-input";
import SmartInput from "react-phone-number-input/smart-input";
import { Flags } from "utils";

const OperatorSetup = () => {
  const [shouldDisplay, setShouldDisplay] = useState(null);
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [cpeIP, setCpeIP] = useState(null);
  const [relayAntennaIPs, setRelayAntennaIPs] = useState(null);
  const [phoneClientAntennaIPs, setPhoneClientAntennaIPs] = useState(null);
  const [mailingAddress, setMailingAddress] = useState(null);
  const [physicalAddress, setPhysicalAddress] = useState(null);
  const [equipmentDetails, setEquipmentDetails] = useState(null);

  const handlePhone = (value) => {
    setPhone(value);
  };

  const [t] = useTranslation();
  useEffect(() => {
    (async () => {
      if (shouldDisplay === null) {
        let display_this_screen = await get("/operator_setup");
        if (!(display_this_screen instanceof Error))
          setShouldDisplay(display_this_screen);
      }
    })();
  });

  let dismiss = async (e) => {
    try {
      setShouldDisplay(null);
      await post(`/operator_setup/false`);
    } catch (e) {}
  };
  let submit = async (e) => {
    try {
      let install_details = {};
      install_details.user_name = userName;
      install_details.phone = phone;
      install_details.email = email;
      install_details.client_antenna_ip = cpeIP;
      install_details.relay_antennas = relayAntennaIPs;
      install_details.phone_client_antennas = phoneClientAntennaIPs;
      install_details.mailing_address = mailingAddress;
      install_details.physical_address = physicalAddress;
      install_details.equipment_details = equipmentDetails;
      await post(`/installation_details`, install_details);
      setShouldDisplay(null);
    } catch (e) {}
  };

  if (!shouldDisplay) {
    return <></>;
  }

  return (
    <Card>
      <h4>{"Pre-deployment Setup"}</h4>

      <div className="mb-1 ml-auto text-left">
        <p>
          {
            "This forum is for an Althea installer, if installation is complete please dismiss"
          }
        </p>
      </div>
      <div
        style={{ color: "#3DADF5", fontSize: 16 }}
        className="mb-1 ml-auto text-right"
      >
        <a href="#dismiss" onClick={dismiss}>
          {t("dismiss")}
        </a>
      </div>
      <InputGroup>
        <Input
          type="text"
          defaultValue={userName}
          placeholder="User Name"
          onChange={(e) => setUserName(e.target.value)}
        />
      </InputGroup>
      <InputGroup>
        <Input
          type="text"
          defaultValue={email}
          placeholder="User Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </InputGroup>
      <InputGroup>
        <PhoneInput
          country="US"
          flags={Flags}
          id="exitPhone"
          inputComponent={SmartInput}
          placeholder="User PhoneNumber"
          value={phone}
          onChange={(p) => handlePhone(p)}
        />
      </InputGroup>
      <InputGroup>
        <Input
          type="text"
          placeholder="CPE IP"
          onChange={(e) => setCpeIP(e.target.value)}
          defaultValue={cpeIP}
        />
      </InputGroup>
      <InputGroup>
        <Input
          type="text"
          placeholder="Relay antenna IPs comma separated list"
          onChange={(e) => setRelayAntennaIPs(e.target.value)}
          defaultValue={relayAntennaIPs}
        />
      </InputGroup>
      <InputGroup>
        <Input
          type="text"
          placeholder="Phone antenna IPs comma separated list"
          onChange={(e) => setPhoneClientAntennaIPs(e.target.value)}
          defaultValue={phoneClientAntennaIPs}
        />
      </InputGroup>
      <InputGroup>
        <Input
          type="text"
          placeholder="Mailing address"
          onChange={(e) => setMailingAddress(e.target.value)}
          defaultValue={mailingAddress}
        />
      </InputGroup>
      <InputGroup>
        <Input
          type="text"
          placeholder="Physical address"
          onChange={(e) => setPhysicalAddress(e.target.value)}
          defaultValue={physicalAddress}
        />
      </InputGroup>
      <InputGroup>
        <Input
          type="textarea"
          placeholder="Equipment details, short summary of hardware"
          onChange={(e) => setEquipmentDetails(e.target.value)}
          defaultValue={equipmentDetails}
        />
      </InputGroup>
      <Button onClick={submit}>submit</Button>
    </Card>
  );
};

export default OperatorSetup;
