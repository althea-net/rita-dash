import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "reactstrap";
import AddExitForm from "./AddExitForm";
import JsonForm from "./JsonForm";
import SyncForm from "./SyncForm";

const AddExit = ({ setAdding }) => {
  const [t] = useTranslation();
  const [fillForm, setFillForm] = useState(false);
  const [pasteJson, setPasteJson] = useState(false);
  const [urlSync, setUrlSync] = useState(false);

  return (
    <>
      {!(fillForm || pasteJson || urlSync) && (
        <div className="d-flex justify-content-around flex-wrap">
          <Button
            color="primary"
            className="mb-2"
            onClick={() => setFillForm(true)}
          >
            {t("addManually")}
          </Button>
          <Button
            color="primary"
            className="mb-2"
            onClick={() => setPasteJson(true)}
          >
            {t("pasteJson")}
          </Button>
          <Button color="primary" 
            className="mb-2"
            onClick={() => setUrlSync(true)}>
            {t("syncFromURL")}
          </Button>
        </div>
      )}
      {fillForm && <AddExitForm setAdding={setAdding} setFillForm={setFillForm} />}
      {pasteJson && <JsonForm setAdding={setAdding} setPasteJson={setPasteJson} />}
      {urlSync && <SyncForm setAdding={setAdding} setUrlSync={setUrlSync} />}
    </>
  );
};

export default AddExit;
