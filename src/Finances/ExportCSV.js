import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CustomInput,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default ({ open, setOpen }) => {
  const [t] = useTranslation();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [exportAll, setExportAll] = useState(false);

  const toggleAll = () => setExportAll(!exportAll);

  return (
    <Modal isOpen={open} size="sm" centered toggle={() => setOpen(!open)}>
      <ModalHeader toggle={() => setOpen(!open)}>
        {t("exportToCsv")}
      </ModalHeader>
      <ModalBody>
        <FormGroup className="d-flex">
          <CustomInput
            type="checkbox"
            onChange={toggleAll}
            value={exportAll}
            checked={exportAll}
            id="exportAll"
            name="exportAll"
          />
          <Label for="exportAll">{t("exportAllData")}</Label>
        </FormGroup>
        <FormGroup>
          <Label>{t("startDate")}</Label>
          <InputGroup className="mr-2">
            <Input
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
            <InputGroupAddon addonType="append">
              <InputGroupText style={{ cursor: "pointer" }}>
                <FontAwesomeIcon icon="calendar" />
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label> {t("endDate")}</Label>
          <InputGroup className="mr-2">
            <Input value={endDate} onChange={e => setEndDate(e.target.value)} />
            <InputGroupAddon addonType="append">
              <InputGroupText style={{ cursor: "pointer" }}>
                <FontAwesomeIcon icon="calendar" />
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
};
