import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../ui";
import { Button, Input, InputGroup, FormGroup, Label } from "reactstrap";
import { get, post } from "store";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { InnerPhoneInput } from "ui";
import { Error } from "utils";

let { protocol, hostname } = window.location;

if (protocol === "file:") {
  protocol = "http:";
  hostname = "192.168.10.1";
}

const port = 4877;
const base =
  process.env.REACT_APP_BACKEND_URL || `${protocol}//${hostname}:${port}`;

const OperatorSetup = () => {
  const [shouldDisplay, setShouldDisplay] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [cpeIP, setCpeIP] = useState(null);
  // on change is only called when a user selects a different value
  // since the dropdown may be correct to start users might not mess with
  // it, so it needs to have a correct starting value.
  const [country, setCountry] = useState("United States");
  const [postalCode, setPostalCode] = useState("");
  const [state, setState] = useState(null);
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [relayAntennaIPs, setRelayAntennaIPs] = useState(null);
  const [physicalAddress, setPhysicalAddress] = useState(null);
  const [equipmentDetails, setEquipmentDetails] = useState("");

  const [error, setError] = useState(false);

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
      install_details.first_name = firstName;
      install_details.last_name = lastName;
      install_details.country = country;
      install_details.state = state;
      install_details.city = city;
      install_details.street = street;
      install_details.postal_code = postalCode;
      install_details.phone = phone;
      install_details.email = email;
      install_details.client_antenna_ip = cpeIP;
      install_details.relay_antennas = relayAntennaIPs;
      install_details.physical_address = physicalAddress;
      install_details.equipment_details = equipmentDetails;
      const res = await fetch(base + `/installation_details`, {
        method: "POST",
        body: JSON.stringify(install_details),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (res.status !== 200) {
        let err = await res.json();
        setError("Submit unsuccessful: " + err);
      } else {
        console.log("Submit successful");
        setError(false);
        setShouldDisplay(null);
      }
    } catch (e) {
      console.log(JSON.stringify(e));
    }
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
      <div style={{ width: "100%" }}>
        <forum className="form-inline">
          <FormGroup style={{ width: "50%" }}>
            <Label>{"First Name"}</Label>
            <Input
              style={{ width: "100%" }}
              type="text"
              defaultValue={firstName}
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </FormGroup>
          <FormGroup style={{ width: "50%" }}>
            <Label>{"Last Name"}</Label>
            <Input
              style={{ width: "100%" }}
              type="text"
              defaultValue={lastName}
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </FormGroup>
        </forum>
        <br />
        <forum className="form-inline">
          <FormGroup style={{ width: "50%" }}>
            <Label>{"Email"}</Label>
            <Input
              style={{ width: "100%" }}
              type="text"
              defaultValue={email}
              placeholder="User Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup
            style={{ width: "49%" }}
            className="mb-1 ml-auto text-right"
          >
            <Label>{"Phonenumber"}</Label>
            <PhoneInput
              style={{ width: "100%" }}
              defaultCountry="US"
              id="exitPhone"
              placeholder="User Phonenumber"
              value={phone}
              onChange={(p) => setPhone(p)}
              inputComponent={InnerPhoneInput}
            />
          </FormGroup>
        </forum>
        <br />
        <Label>{"Street"}</Label>
        <InputGroup>
          <Input
            type="text"
            placeholder="Street"
            defaultValue={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </InputGroup>
        <forum className="form-inline">
          <FormGroup style={{ width: "25%" }}>
            <Label>{"Postal Code"}</Label>
            <Input
              style={{ width: "100%" }}
              type="text"
              defaultValue={postalCode}
              placeholder="Postal Code"
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </FormGroup>
          <FormGroup style={{ width: "25%" }}>
            <Label>{"City"}</Label>
            <Input
              style={{ width: "100%" }}
              type="text"
              defaultValue={city}
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
            />
          </FormGroup>
          <FormGroup style={{ width: "25%" }}>
            <Label>{"State"}</Label>
            <Input
              style={{ width: "100%" }}
              type="text"
              defaultValue={state}
              placeholder="State"
              onChange={(e) => setState(e.target.value)}
            />
          </FormGroup>
          <FormGroup style={{ width: "25%" }}>
            <Label>{"Country"}</Label>
            <Input
              style={{ width: "100%" }}
              type="select"
              defaultValue={country}
              placeholder="Country"
              onChange={(e) => setCountry(e.target.value)}
            >
              <option defaultValue="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="Mexico">Mexico</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Ghana">Ghana</option>
              <option value="Uganda">Uganda</option>
              <option value="Kenya">Kenya</option>
              <option value="The Bahamas">The Bahamas</option>
              <option value="Other">Other</option>
            </Input>
          </FormGroup>
        </forum>
        <br />
        <Label>{"Physical Address (If different from mailing)"}</Label>
        <InputGroup>
          <Input
            type="text"
            placeholder="Physical address"
            onChange={(e) => setPhysicalAddress(e.target.value)}
            defaultValue={physicalAddress}
          />
        </InputGroup>
        <br />
        <Label>{"CPE IP"}</Label>
        <InputGroup>
          <Input
            type="text"
            placeholder="CPE IP"
            onChange={(e) => setCpeIP(e.target.value)}
            defaultValue={cpeIP}
          />
        </InputGroup>
        <br />
        <Label>{"Relay Antenna IPs"}</Label>
        <InputGroup>
          <Input
            type="text"
            placeholder="Relay antenna IPs comma separated list"
            onChange={(e) => setRelayAntennaIPs(e.target.value)}
            defaultValue={relayAntennaIPs}
          />
        </InputGroup>
        <br />
        <Label>{"Equipment details"}</Label>
        <InputGroup>
          <Input
            type="textarea"
            placeholder="Equipment details, short summary of hardware"
            onChange={(e) => setEquipmentDetails(e.target.value)}
            defaultValue={equipmentDetails}
          />
        </InputGroup>
        <br />
        <Error error={error} />
        <Button onClick={submit}>Submit</Button>
      </div>
    </Card>
  );
};

export default OperatorSetup;
