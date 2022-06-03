import React from "react";
import styled from "styled-components";
import { Button, Card as Boot, CardBody } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import media from "media";

export const Left = styled.div.attrs({
  className: "d-flex flex-column justify-content-between pr-lg-4 col-md-6",
})`
  ${media.mobile`border-bottom: 1px solid #dadada; padding-bottom: 20px; margin-bottom: 20px`};
  ${media.desktop`border-right: 1px solid #dadada;`};
`;

export const Right = styled.div.attrs({
  className: "pl-4 col-md-6 d-flex",
})``;

export const Card = ({ children }) => (
  <Boot className="mb-4">
    <CardBody className="d-flex flex-wrap px-0 px-lg-2">{children}</CardBody>
  </Boot>
);

export const Heading = ({ title, link, linkText }) => (
  <div className="w-100 d-flex justify-content-between">
    <h2>{title}</h2>
    <div style={{ color: "#3DADF5" }} className="my-auto">
      <a href={link}>
        {linkText}
        <FontAwesomeIcon
          size="lg"
          icon="angle-right"
          style={{ marginLeft: 10 }}
        />
      </a>
    </div>
  </div>
);
