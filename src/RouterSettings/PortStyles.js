import React from "react";
import styled from "styled-components";
import { Button, Card, CardBody } from "reactstrap";
import glImage from "images/gl.jpg";
import linksysImage from "images/linksyswrt3200acm.jpg";
import linksysEaImage from "images/linksysea6350v3.jpg";

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
  width: 100%;
  background: ${props => (props.selected ? "#0BB36D" : "white")} !important;
  color: ${props => (props.selected ? "white" : "gray")} !important;
  border: 1px solid #aaa;
  border-color: ${props => (props.selected ? "#0BB36D" : "#aaa")} !important;
  border-radius: 0 !important;
  margin-top: 6px;
  font-weight: normal !important;
  font-size: 20px !important;
  padding: 0.5rem 0.7rem !important;
  white-space: nowrap;
`;

export const RouterImage = styled.img`
  margin: 20px;
  width: 300px;
`;

const StyledCard = styled(Card)`
  border-radius: 0px !important;
  box-shadow: none !important;
  border: 1px solid #eee !important;
  margin-left: -1px;
  margin-bottom: 10px;
`;

export const PortColumn = props => (
  <StyledCard className="col-12 col-sm-6 col-md-4 p-0">
    <CardBody className="text-center w-100 px-1">{props.children}</CardBody>
  </StyledCard>
);

const GL = () => {
  return <RouterImage src={glImage} alt="GL B-1300" />;
};

const LinkSys = () => {
  return <RouterImage src={linksysImage} alt="Linksys WRT 3200ACM" />;
};

const LinkSysEa = () => {
  return <RouterImage src={linksysEaImage} alt="Linksys EA 6350 v3" />;
};

const deviceImages = {
  "gl-b1300": <RouterImage src={glImage} alt="GL B-1300" />,
  linksys_ea6350v3: (
    <RouterImage src={linksysEaImage} alt="Linksys EA 6350 v3" />
  ),
  "linksys-wrt3200acm": (
    <RouterImage src={linksysImage} alt="Linksys WRT 3200ACM" />
  ),
  "linksys-wrt32x": <RouterImage src={linksysImage} alt="Linksys WRT 3200ACM" />
};

export const Device = ({ device }) => (
  <div className="text-center">{deviceImages[device]}</div>
);
