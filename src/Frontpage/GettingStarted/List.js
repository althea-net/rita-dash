import React from "react";
import { useTranslation } from "react-i18next";
import { CustomInput, Label } from "reactstrap";

const List = ({ steps }) => {
  const [t] = useTranslation();

  return (
    <ul className="mb-0">
      {steps.map(({ name, completed, onClick }) => (
        <li style={{ listStyle: "none" }} className="d-flex" key={name}>
          <CustomInput
            type="checkbox"
            id={name}
            name={name}
            checked={completed}
            readOnly
            onClick={onClick}
            value="yes"
          />
          <Label
            for={name}
            style={{
              color: "#6C757D",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            {t(name)}
          </Label>
        </li>
      ))}
    </ul>
  );
};

export default List;
