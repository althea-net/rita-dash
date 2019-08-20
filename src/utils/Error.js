import React from "react";
import { Alert } from "reactstrap";

const Error = ({ error }) => {
  if (!error) return null;
  return <Alert color="danger">{error}</Alert>;
};

export default Error;
