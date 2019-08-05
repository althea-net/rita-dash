import React from "react";
import { useTranslation } from "react-i18next";
import { CustomInput, Label } from "reactstrap";

const List = ({ steps }) => {
  const [t] = useTranslation();

  return (
    <ul>
      {steps.map(step => (
        <li style={{ listStyle: "none" }} className="d-flex" key={step.name}>
          <CustomInput
            type="checkbox"
            id={step.name}
            name={step.name}
            checked={step.completed}
            readOnly
            onClick={step.onClick}
            value="yes"
          />
          <Label
            for={step.name}
            style={{
              color: "#6C757D",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            {t(step.name)}
          </Label>
        </li>
      ))}
    </ul>
  );
};

export default List;
