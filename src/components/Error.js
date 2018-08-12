import React from "react";
import { connect } from "../store";
import { Alert } from "reactstrap";

export default connect(["error"])(({ state }) => {
  if (!state.error) return null;
  return <Alert color="danger">{state.error}</Alert>;
});
