import React from "react";
import { Alert } from "reactstrap";

const Warning = ({ message }) => {
  if (!message) return null;
  return <Alert color="warning">{message}</Alert>;
};

export default Warning;
