import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Tooltip,
  Input,
  FormGroup,
  Label,
  InputGroup,
} from "reactstrap";
import QR from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { get, useStore, post } from "store";
import { toEth, Flags } from "utils";
import PhoneInput from "react-phone-number-input";
import SmartInput from "react-phone-number-input/smart-input";

const qrStyle = { height: "auto", width: "80%" };

async function submit(billing_details, phone, email, setState) {
  try {
    await post("/billing_details", billing_details, false);
    await post(`/phone`, phone);
    await post(`/email`, email);
    setState("selectAmount");
  } catch (e) {}
}

async function get_wyre_url_and_redirect(amount) {
  let amountJson = {};
  amountJson["amount"] = amount;
  try {
    let res = await post("/wyre_reservation", amountJson);
    window.location.replace(res.url);
  } catch (e) {}
}

function user_info_forum(
  billingDetails,
  setBillingDetails,
  email,
  setEmail,
  phone,
  setPhone,
  submit,
  canEdit,
  setState
) {
  if (!billingDetails) {
    billingDetails = {};
    billingDetails["mailing_address"] = {};
    billingDetails.mailing_address["country"] = "United States";
  }
  return (
    <div style={{ width: "100%" }}>
      <p>Please review your contact info before continuing.</p>
      <h5>Contact Info</h5>
      <forum class="form-inline">
        <FormGroup style={{ width: "50%" }}>
          <Label>{"First Name"}</Label>
          <Input
            disabled={canEdit}
            style={{ width: "100%" }}
            type="text"
            defaultValue={billingDetails.user_first_name}
            placeholder="First Name"
            onChange={(e) => {
              let local = billingDetails;
              local.user_first_name = e.target.value;
              setBillingDetails(local);
            }}
          />
        </FormGroup>
        <FormGroup style={{ width: "50%" }}>
          <Label>{"Last Name"}</Label>
          <Input
            disabled={canEdit}
            style={{ width: "100%" }}
            type="text"
            defaultValue={billingDetails.user_last_name}
            placeholder="Last Name"
            onChange={(e) => {
              let local = billingDetails;
              local.user_last_name = e.target.value;
              setBillingDetails(local);
            }}
          />
        </FormGroup>
      </forum>
      <br />
      <forum class="form-inline">
        <FormGroup style={{ width: "50%" }}>
          <Label>{"Email"}</Label>
          <Input
            disabled={canEdit}
            style={{ width: "100%" }}
            type="text"
            defaultValue={email}
            placeholder="User Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup style={{ width: "49%" }} className="mb-1 ml-auto text-right">
          <Label>{"Phonenumber"}</Label>
          <PhoneInput
            disabled={canEdit}
            style={{ width: "100%" }}
            country="US"
            flags={Flags}
            id="exitPhone"
            inputComponent={SmartInput}
            placeholder="User Phonenumber"
            value={phone}
            onChange={(p) => setPhone(p)}
          />
        </FormGroup>
      </forum>
      <br />
      <h5>Address</h5>
      <Label>{"Street"}</Label>
      <InputGroup>
        <Input
          disabled={canEdit}
          type="text"
          placeholder="Street"
          defaultValue={billingDetails.mailing_address.street}
          onChange={(e) => {
            let local = billingDetails;
            local.mailing_address.street = e.target.value;
            setBillingDetails(local);
          }}
        />
      </InputGroup>
      <forum class="form-inline">
        <FormGroup style={{ width: "25%" }}>
          <Label>{"Postal Code"}</Label>
          <Input
            disabled={canEdit}
            style={{ width: "100%" }}
            type="text"
            defaultValue={billingDetails.mailing_address.postal_code}
            placeholder="Postal Code"
            onChange={(e) => {
              let local = billingDetails;
              local.mailing_address.postal_code = e.target.value;
              setBillingDetails(local);
            }}
          />
        </FormGroup>
        <FormGroup style={{ width: "25%" }}>
          <Label>{"City"}</Label>
          <Input
            disabled={canEdit}
            style={{ width: "100%" }}
            type="text"
            defaultValue={billingDetails.mailing_address.city}
            placeholder="City"
            onChange={(e) => {
              let local = billingDetails;
              local.mailing_address.city = e.target.value;
              setBillingDetails(local);
            }}
          />
        </FormGroup>
        <FormGroup style={{ width: "25%" }}>
          <Label>{"State"}</Label>
          <Input
            disabled={canEdit}
            style={{ width: "100%" }}
            type="text"
            defaultValue={billingDetails.mailing_address.state}
            placeholder="State"
            onChange={(e) => {
              let local = billingDetails;
              local.mailing_address.state = e.target.value;
              setBillingDetails(local);
            }}
          />
        </FormGroup>
        <FormGroup style={{ width: "25%" }}>
          <Label>{"Country"}</Label>
          <Input
            disabled={canEdit}
            style={{ width: "100%" }}
            type="select"
            defaultValue={billingDetails.mailing_address.country}
            placeholder="Country"
            onChange={(e) => {
              let local = billingDetails;
              local.mailing_address.country = e.target.value;
              setBillingDetails(local);
            }}
          >
            <option selected value="US">
              United States
            </option>
            <option value="CA">Canada</option>
            <option value="MX">Mexico</option>
            <option value="NG">Nigeria</option>
            <option value="GH">Ghana</option>
            <option value="UG">Uganda</option>
            <option value="KE">Kenya</option>
            <option value="BS">The Bahamas</option>
            <option value="Other">Other</option>
          </Input>
        </FormGroup>
      </forum>
      <br />
      <Button
        color="primary"
        onClick={(e) => {
          submit(billingDetails, phone, email, setState);
        }}
      >
        {"Continue"}
      </Button>
    </div>
  );
}

const Deposit = ({ open, setOpen }) => {
  const [t] = useTranslation();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(null);
  const [wyreEnabled, setWyreEnabled] = useState(false);
  const [operatorDebt, setOperatorDebt] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [billingDetails, setBillingDetails] = useState("");
  // this variable controls our progression through the depositing state
  // machine, displaying one of several options each time. States are
  // None: display no modal
  // QR: Display the QR code, this only returns to None
  // reviewDetails: This is where the user views and possibly updates their details
  //                can return to none or progress to selectAmount
  // selectAmount:  The user selects the amount they would like to deposit, the user
  //                will either leave the page to go to wyre or return to None
  const [modalDisplayState, setModalDisplayState] = useState("");

  const toggle = () => {
    if (modalDisplayState === "None") {
      if (wyreEnabled) {
        setModalDisplayState("reviewDetails");
      } else {
        setModalDisplayState("QR");
      }
    } else {
      setModalDisplayState("None");
      setOpen(false);
    }
  };

  const [{ address, debt, lowBalance, status, symbol }] = useStore();

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      if (loading == null) {
        setLoading(true);
        let billingDetails = await get("/billing_details", false);
        let operatorDebt = await get("/operator_debt");
        let email = await get("/email");
        let phone = await get("/phone");
        let { wyreEnabled } = await get("/localization");

        if (!(phone instanceof Error)) setPhone(phone);
        if (!(email instanceof Error)) setEmail(email);
        if (!(billingDetails instanceof Error))
          setBillingDetails(billingDetails);
        if (!(operatorDebt instanceof Error)) setOperatorDebt(operatorDebt);
        if (!(wyreEnabled instanceof Error)) setWyreEnabled(wyreEnabled);

        setLoading(false);
      }
    })();

    return () => controller.abort();
  });

  if ((modalDisplayState === "" || modalDisplayState === "None") && open) {
    if (wyreEnabled) {
      setModalDisplayState("reviewDetails");
    } else {
      setModalDisplayState("QR");
    }
  }

  let decimals = symbol === "Dai" ? 2 : 4;
  let minDeposit =
    Number(toEth(debt, decimals)) * 2 + Number(toEth(operatorDebt, decimals));
  if (status) minDeposit = status.reserveAmount + minDeposit;

  const recommendedDeposit = `${minDeposit} ${symbol}`;

  if (!address) return null;

  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  let modal_body;
  let modal_header = t("addFunds");

  // the modal size, edited for when a message case needs a larger modal
  let size = "sm";
  if (wyreEnabled && modalDisplayState === "reviewDetails") {
    size = "lg";
    modal_header = "Review Contact info";

    modal_body = user_info_forum(
      billingDetails,
      setBillingDetails,
      email,
      setEmail,
      phone,
      setPhone,
      submit,
      false,
      setModalDisplayState
    );
  } else if (wyreEnabled && modalDisplayState === "selectAmount") {
    size = "md";
    modal_header = "Select deposit amount";
    modal_body = (
      <div>
        <h5>Please select an amount to deposit from the choices below.</h5>

        <p>
          You will be redirected to our payment processor. Our payment processor
          is international, so charges may come from outside the United States.{" "}
        </p>
        <p>
          If you experience any problems please call us at{" "}
          <a href="tel:8664258432">1-866-4ALTHEA</a> Thank you!
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            onClick={(e) => {
              get_wyre_url_and_redirect(20.0);
            }}
            outline
            color="primary"
          >
            $20
          </Button>
          <Button
            onClick={(e) => {
              get_wyre_url_and_redirect(40.0);
            }}
            outline
            color="primary"
          >
            $40
          </Button>
          <Button
            onClick={(e) => {
              get_wyre_url_and_redirect(60.0);
            }}
            outline
            color="primary"
          >
            $60
          </Button>
          <Button
            onClick={(e) => {
              get_wyre_url_and_redirect(100.0);
            }}
            outline
            color="primary"
          >
            $100
          </Button>
        </div>
      </div>
    );
  } else if (modalDisplayState === "QR") {
    modal_body = (
      <>
        <div
          className="mb-4 shadow-none d-flex flex-wrap"
          style={{
            border: "1px solid #ddd",
            borderRadius: 5,
            wordWrap: "break-word",
          }}
        >
          <div className="d-flex py-2 px-0 w-100">
            <div className="col-11" id="walletAddr">
              {address}
            </div>

            <Tooltip placement="top" isOpen={copied} target="copy">
              {t("copied")}
            </Tooltip>
            <CopyToClipboard text={address} onCopy={copy}>
              <FontAwesomeIcon
                id="copy"
                icon="copy"
                color="#999"
                className="mr-2"
                style={{ cursor: "pointer" }}
              />
            </CopyToClipboard>
          </div>
        </div>
        <div className="w-100 text-center mb-4">
          <QR style={qrStyle} value={address} />
        </div>

        <div>
          {lowBalance &&
            minDeposit > 0 &&
            t("recommendedDeposit", { recommendedDeposit })}
        </div>
      </>
    );
  }
  return (
    <Modal
      isOpen={open && !loading}
      // this resets the contact details review modal flow
      // the flow goes, depositing true -> false
      // which shows the selection modal if appropriate
      // if you show the selection modal once contactDetailsReviewModal
      // is set to true it shows the final warning page then
      // the user exits.
      // both warning modal and depositing are reset here
      onExit={() => {
        setOpen(false);
      }}
      size={size}
      centered
      toggle={toggle}
    >
      <ModalHeader>{modal_header}</ModalHeader>
      <ModalBody>{modal_body}</ModalBody>
    </Modal>
  );
};

export default Deposit;
