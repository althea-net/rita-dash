import React from "react";
import { Alert } from "reactstrap";

export default ({ error }) => {
  if (!error) return null;
  return <Alert color="danger">{error}</Alert>;
};
