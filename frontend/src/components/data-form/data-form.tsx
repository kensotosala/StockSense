import React, { useState } from "react";
import CustomInputFile from "../custom-input-file/customInputFile";
import "./data-form.css";
import { submitInventoryData } from "../../services/InventoryService";
import type { InventoryReportItem } from "../../types/inventory";
import DialogResults from "../DialogResults/DialogResults";

interface DataFormProps {
  handleToggleDialog: () => void;
}

const DataForm = ({ handleToggleDialog }: DataFormProps) => {
  // File States
  const [salesData, setSalesData] = useState<File | null>(null);
  const [currentInventory, setCurrentInventory] = useState<File | null>(null);

  // Text States
  const [inventoryHistoryDays, setInventoryHistoryDays] = useState("");

  const [coverageDays, setCoverageDays] = useState("");
  const [bufferDays, setBufferDays] = useState("");
  const [leadTime, setLeadTime] = useState("");

  // Loading & Dialog States
  const [isLoading, setIsLoading] = useState(false);
  const [openResultsDialog, setOpenResultsDialog] = useState(false);
  const [reportData, setReportData] = useState<InventoryReportItem[]>([]);

  // Function to open the ResultsDialog
  const handleToggleResultsDialog = () => {
    setOpenResultsDialog((prev) => !prev);
  };

  // Function to process and send the form
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!salesData || !currentInventory) {
      alert("Please upload the required files.");
      return;
    }

    setIsLoading(true);

    try {
      // Waiting the API response
      const report = await submitInventoryData({
        sells: salesData,
        actualInventory: currentInventory,
        inventoryHistoryDays,
        coverageDays,
        bufferDays,
        leadTime,
      });

      // Save the data y open the DialogResults
      setReportData(report);
      setOpenResultsDialog(true);
    } catch (error) {
      console.error("Hubo un error al intentar guardar el formulario: ", error);
      alert("Ocurrió un error al procesar los datos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="spinner"></div>
      ) : openResultsDialog ? (
        <DialogResults
          data={reportData}
          handleOpenCloseDialog={handleToggleResultsDialog}
        />
      ) : (
        <div className="form-container">
          <div className="wrapper-btn-close">
            <button onClick={handleToggleDialog} className="btn-close">
              X
            </button>
          </div>

          <h2>Completa el Formulario</h2>
          <form onSubmit={handleSubmit} className="data-form">
            <div className="form-row">
              <div className="form-column">
                <CustomInputFile
                  label_text="Sales Data"
                  input_id="sales-data"
                  file_type=".csv"
                  input_type="file"
                  htmlFor="sales-data"
                  span_id="sales-data-info"
                  onChange={(file) => setSalesData(file)}
                />
              </div>

              <div className="form-column">
                <CustomInputFile
                  label_text="Current Inventory"
                  input_id="current-inventory-data"
                  file_type=".csv"
                  input_type="file"
                  htmlFor="current-inventory-data"
                  span_id="current-inventory-data-info"
                  onChange={(file) => setCurrentInventory(file)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-column">
                <label htmlFor="history-days">Inventory Data Days</label>
                <input
                  id="history-days"
                  type="text"
                  value={inventoryHistoryDays}
                  onChange={(e) => setInventoryHistoryDays(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="form-column">
                <label htmlFor="coverage-days">Coverage Days</label>
                <input
                  id="coverage-days"
                  type="text"
                  value={coverageDays}
                  onChange={(e) => setCoverageDays(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-column">
                <label htmlFor="buffer-days">Buffer Days</label>
                <input
                  id="buffer-days"
                  type="text"
                  value={bufferDays}
                  onChange={(e) => setBufferDays(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="form-column">
                <label htmlFor="lead-time">Lead Time</label>
                <input
                  id="lead-time"
                  type="text"
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-get-started"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default DataForm;
