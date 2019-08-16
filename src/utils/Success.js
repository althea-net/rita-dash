import React from "react";
import { Alert } from "reactstrap";

const Success = ({ message }) => {
  if (!message) return null;
  return (
    <Alert color="success" className="text-break">
      {message}
    </Alert>
  );
};

export default Success;
