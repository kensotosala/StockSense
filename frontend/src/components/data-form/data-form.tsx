import React, { useState } from "react";
import CustomInputFile from "../custom-input-file/customInputFile";
import "./data-form.css";
import { submitInventoryData } from "../../services/InventoryService";

interface DataFormProps {
  handleToggleDialog: () => void;
}

const DataForm = ({ handleToggleDialog }: DataFormProps) => {
  // File States
  const [salesData, setSalesData] = useState<File | null>(null);
  const [currentInventory, setCurrentInventory] = useState<File | null>(null);
  const [inventoryHistoryDays, setInventoryHistoryDays] = useState<File | null>(
    null,
  );

  // Text States
  const [coverageDays, setCoverageDays] = useState("");
  const [bufferDays, setBufferDays] = useState("");
  const [leadTime, setLeadTime] = useState("");

  // Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to process and send the form
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Form Validation
    if (!salesData || !currentInventory || !inventoryHistoryDays) {
      alert("Please upload the required files.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 🔥 Llamamos al servicio externo pasándole el objeto estructurado
      await submitInventoryData({
        salesData,
        currentInventory,
        inventoryHistoryDays,
        coverageDays,
        bufferDays,
        leadTime,
      });

      alert("¡Datos y archivos enviados con éxito!");
      handleToggleDialog();
    } catch (error) {
      alert("Hubo un error al intentar guardar el formulario." + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="wrapper-btn-close">
        <button onClick={handleToggleDialog} className="btn-close">
          X
        </button>
      </div>
      {/* Form */}
      <h2>Completa el Formulario</h2>
      <form onSubmit={handleSubmit} className="data-form">
        <div className="form-row">
          {/* Sales Data */}
          <div className="form-column">
            {/* <label htmlFor="">Sales Data</label>
            <input type="file" /> */}
            <CustomInputFile
              label_text="Sales Data"
              input_id="sales-data"
              file_type=".csv"
              input_type="file"
              htmlFor="sales-data"
              span_id="sales-data-info"
              onChange={(file) => setInventoryHistoryDays(file)}
            />
          </div>

          {/* Current Inventory */}
          <div className="form-column">
            {/* <label htmlFor="">Current Inventory</label>
            <input type="file" /> */}
            <CustomInputFile
              label_text="Current Inventory"
              input_id="current-inventory-data"
              file_type=".csv"
              input_type="file"
              htmlFor="current-inventory-data"
              span_id="current-inventory-data-info"
              onChange={(file) => setInventoryHistoryDays(file)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            {/* Inventory History Days */}
            <CustomInputFile
              label_text="Inventory History Days"
              input_id="inventory-data"
              file_type=".csv"
              input_type="file"
              htmlFor="inventory-data"
              span_id="inventory-data-info"
              onChange={(file) => setInventoryHistoryDays(file)}
            />

            {/* <label htmlFor="">Inventory Data Days</label>
            <input type="text" /> */}
          </div>

          {/* Coverage Days */}
          <div className="form-column">
            <label htmlFor="">Coverage Days</label>
            <input
              id="coverage-days"
              type="text"
              value={coverageDays}
              onChange={(e) => setCoverageDays(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-row">
          {/* Buffer Days */}
          <div className="form-column">
            <label htmlFor="">Buffer Days</label>
            <input
              id="buffer-days"
              type="text"
              value={bufferDays}
              onChange={(e) => setBufferDays(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          {/* Lead Time */}
          <div className="form-column">
            <label htmlFor="">Lead Time</label>
            <input
              id="lead-time"
              type="text"
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn-get-started"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default DataForm;
