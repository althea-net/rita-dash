import React from "react";
import { Alert } from "reactstrap";

export default ({ message }) => {
  if (!message) return null;
  return (
    <Alert color="success" className="text-break">
      {message}
    </Alert>
  );
};
