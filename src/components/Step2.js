import React, { useState } from "react";
import envelope from "../images/email.png";
import { Form, FormGroup, Input } from "reactstrap";

export default ({ exit }) => {
  const [email, setEmail] = useState("");
  return (
    <div>
      <h5>Email Address</h5>
      <div className="d-flex p-4">
        <img src={envelope} alt="Envelope" className="mr-4" />
        <div>
          <p>
            Please enter your email address to receive a confirmation code to
            connect to this node.
          </p>
          <Form>
            <FormGroup>
              <Input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email Address"
                style={{ width: 300 }}
              />
            </FormGroup>
          </Form>
        </div>
      </div>
    </div>
  );
};
