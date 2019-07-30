import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  CustomInput,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import dateFnsLocalizer, { defaultFormats } from "react-widgets-date-fns";
import { DateTimePicker } from "react-widgets";
import "react-widgets/dist/css/react-widgets.css";
import { enUS as en, es, fr } from "date-fns/locale";

dateFnsLocalizer({ formats: defaultFormats, locales: { en, es, fr } });

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
          <DateTimePicker
            value={startDate}
            onChange={v => setStartDate(v)}
            format={"yyyy-MM-dd"}
            time={false}
            disabled={exportAll}
          />
        </FormGroup>
        <FormGroup>
          <Label> {t("endDate")}</Label>
          <DateTimePicker
            value={endDate}
            onChange={v => setEndDate(v)}
            format={"yyyy-MM-dd"}
            time={false}
            disabled={exportAll}
          />
        </FormGroup>
        <div className="d-flex justify-content-between">
          <Button color="primary" outline className="w-50 mr-2">
            {t("cancel")}
          </Button>
          <Button color="primary" className="w-50">
            {t("export")}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};
