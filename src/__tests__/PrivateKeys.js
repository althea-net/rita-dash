import React from "react";
import { render, cleanup } from "react-testing-library";
import PrivateKeys from "../components/PrivateKeys";
import "../i18n";

afterEach(cleanup);

test("displays heading", () => {
  const { getByText } = render(<PrivateKeys />);
  expect(getByText("Private Keys")).toBeTruthy();
});
