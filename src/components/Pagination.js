import React from "react";
import styled from "styled-components";

export default styled(({ className }) => {
  return (
    <div className={className + " d-flex justify-content-center text-center"}>
      <div>&laquo;</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>&raquo;</div>
    </div>
  );
})`
  > div {
    border: 1px solid #dadada;
    width: 40px;
    height: 40px;
    padding-top: 9px;
    margin-left: -1px;
    font-size: 14px;
    color: blue;
    cursor: pointer;

    &:first-child {
      border-radius: 3px;
      border-right: none;
    }

    &:last-child {
      border-left: none;
      border-radius: 3px;
      padding-left: 4px;
      margin-left: -3px;
    }
  }
`;
