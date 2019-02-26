import React from "react";
import styled from "styled-components";
import { Button, Card, CardBody } from "reactstrap";
import glImage from "images/gl.jpg";

export const PortNumber = styled.div`
  position: absolute;
  top: 30px;
  left: calc(50% - 6px);
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px #666;
  text-align: center;
  color: white;
  height: 40px;
  padding-top: 4px;
`;

export const PortToggle = styled(Button)`
  width: 90px;
  background: ${props => (props.selected ? "#0BB36D" : "white")} !important;
  color: ${props => (props.selected ? "white" : "gray")} !important;
  border: 1px solid #aaa;
  border-color: ${props => (props.selected ? "#0BB36D" : "#aaa")} !important;
  border-radius: 0;
  margin-top: 6px;
`;

export const RouterImage = styled.img`
  margin: 20px;
  width: 300px;
`;

const StyledCard = styled(Card)`
  border-radius: 0px !important;
`;

export const PortColumn = props => (
  <StyledCard className="col-4 p-0">
    <CardBody className="text-center mx-auto px-1">{props.children}</CardBody>
  </StyledCard>
);

const GL = () => {
  return <RouterImage src={glImage} alt="GL B-1300" />;
};

const deviceImages = {
  "gl-b1300": <GL />
};

export const Device = ({ device }) => (
  <div className="text-center">{deviceImages[device]}</div>
);
