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
import "react-phone-number-input/style.css";
import ClipLoader from "react-spinners/ClipLoader";

const qrStyle = { height: "auto", width: "80%" };

async function submit(billing_details, phone, email, setState) {
  try {
    await post("/billing_details", billing_details, false);
    await post(`/phone`, phone);
    await post(`/email`, email);
    setState("selectAmount");
  } catch (e) {}
}

async function redirect_to_myalthea(amount, address) {
  try {
    let url = `https://my.althea.net`;
    window.open(url, "_blank");
  } catch (e) {}
}

function user_info_form(
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
            defaultCountry="US"
            flags={Flags}
            id="exitPhone"
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
  //                will either leave the page to go to the payment processor or return to None
  const [modalDisplayState, setModalDisplayState] = useState("");
  const [{ address, debt, lowBalance, status, symbol }] = useStore();

  // set this to true, but keep it here to make it easier to reconnect to the backend
  const addFundsEnabled = true;

  const toggle = () => {
    setOpen(!open);
    if (addFundsEnabled) {
      setModalDisplayState("reviewDetails");
    } else {
      setModalDisplayState("QR");
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      if (loading == null) {
        setLoading(true);
        let billingDetails = await get("/billing_details", false);
        let operatorDebt = await get("/operator_debt");
        let email = await get("/email");
        let phone = await get("/phone");

        if (!(phone instanceof Error)) setPhone(phone);
        if (!(email instanceof Error)) setEmail(email);
        if (!(billingDetails instanceof Error))
          setBillingDetails(billingDetails);
        if (!(operatorDebt instanceof Error)) setOperatorDebt(operatorDebt);

        setLoading(false);
        if (addFundsEnabled) {
          setModalDisplayState("reviewDetails");
        } else {
          setModalDisplayState("QR");
        }
      }
    })();

    return () => controller.abort();
  });

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
  if (addFundsEnabled && modalDisplayState === "reviewDetails") {
    size = "lg";
    modal_header = "Review Contact info";

    modal_body = user_info_form(
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
  } else if (addFundsEnabled && modalDisplayState === "selectAmount") {
    size = "md";
    modal_body = (
      <div>
        <p>
          You can see your balance and deposit funds from the management page on
          my.althea.net You can login with the phone number you just set in the
          previous step.
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
              redirect_to_myalthea();
            }}
            outline
            color="primary"
          >
            Go to my.althea.net
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
  } else {
    modal_body = (
      <ClipLoader
        color="#89CFF0"
        loading={loading != null && loading}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );
  }
  return (
    <Modal
      isOpen={open}
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
