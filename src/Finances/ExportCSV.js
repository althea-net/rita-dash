import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  CustomInput,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import dateFnsLocalizer, { defaultFormats } from "react-widgets-date-fns";
import { DateTimePicker } from "react-widgets";
import "react-widgets/dist/css/react-widgets.css";
import { enUS as en, es, fr } from "date-fns/locale";

dateFnsLocalizer({ formats: defaultFormats, locales: { en, es, fr } });
const msPerHr = 3600000;

const ExportCSV = ({ open, setOpen, rows }) => {
  const [t] = useTranslation();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [exportAll, setExportAll] = useState(false);

  const toggleAll = () => setExportAll(!exportAll);

  useEffect(() => {
    if (exportAll) {
      const indices = rows.map((r) => r.index);
      setStartDate(new Date(Math.min(...indices) * msPerHr));
      setEndDate(new Date(Math.max(...indices) * msPerHr));
    }
  }, [exportAll, rows]);

  if (!rows.length) return null;
  const keys = Object.keys(rows[0]).filter((k) => k !== "index");

  const csv =
    keys.map((k) => `"${t(k)}"`).join(",") +
    "\n" +
    rows.map((r) => keys.map((k) => `"${r[k]}"`).join(",")).join("\n");

  const save = () => {
    const filename = "usage.csv";
    let blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      let link = document.createElement("a");
      if (link.download !== undefined) {
        let url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const toggle = () => setOpen(!open);

  return (
    <Modal isOpen={open} size="sm" centered toggle={toggle}>
      <ModalHeader toggle={toggle}>{t("exportToCsv")}</ModalHeader>
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
            onChange={(v) => setStartDate(v)}
            format={"yyyy-MM-dd"}
            time={false}
            disabled={exportAll}
          />
        </FormGroup>
        <FormGroup>
          <Label> {t("endDate")}</Label>
          <DateTimePicker
            value={endDate}
            onChange={(v) => setEndDate(v)}
            format={"yyyy-MM-dd"}
            time={false}
            disabled={exportAll}
          />
        </FormGroup>
        <div className="d-flex justify-content-between">
          <Button
            color="primary"
            outline
            className="w-50 mr-2"
            onClick={toggle}
          >
            {t("cancel")}
          </Button>
          <Button color="primary" className="w-50" onClick={save}>
            {t("export")}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ExportCSV;
