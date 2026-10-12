import React, { useState } from "react";
import CustomInputFile from "../custom-input-file/customInputFile";
import "./InventoryDataForm.css";
import { submitInventoryData } from "../../services/InventoryService";
import type { InventoryReportResponse } from "../../types/inventory";
import DialogResults from "../DialogResults/DialogResults";

interface DataFormProps {
  handleToggleDialog: () => void;
}

const DataForm = ({ handleToggleDialog }: DataFormProps) => {
  const [salesData, setSalesData] = useState<File | null>(null);
  const [currentInventory, setCurrentInventory] = useState<File | null>(null);

  const [inventoryHistoryDays, setInventoryHistoryDays] = useState("");
  const [coverageDays, setCoverageDays] = useState("");
  const [bufferDays, setBufferDays] = useState("");
  const [leadTime, setLeadTime] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [openResultsDialog, setOpenResultsDialog] = useState(false);

  const [reportData, setReportData] = useState<InventoryReportResponse | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const lastPostIndex = currentPage * rowsPerPage;
  const firstPostIndex = lastPostIndex - rowsPerPage;

  const currentData =
    reportData?.items.slice(firstPostIndex, lastPostIndex) ?? [];

  const handleToggleResultsDialog = () => {
    setOpenResultsDialog((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!salesData || !currentInventory) {
      alert("Please upload the required files.");
      return;
    }

    setIsLoading(true);

    try {
      const report = await submitInventoryData({
        sells: salesData,
        actualInventory: currentInventory,
        inventoryHistoryDays,
        coverageDays,
        bufferDays,
        leadTime,
      });

      setReportData(report);
      setCurrentPage(1);
      setOpenResultsDialog(true);
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      alert("Ocurrió un error al procesar los datos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="spinner"></div>
      ) : openResultsDialog && reportData ? (
        <DialogResults
          data={currentData}
          reportId={reportData.report_id}
          handleOpenCloseDialog={handleToggleResultsDialog}
          totalRows={reportData.items.length}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
        />
      ) : (
        <div className="form-container">
          <div className="wrapper-btn-close">
            <button
              type="button"
              onClick={handleToggleDialog}
              className="btn-close"
            >
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
                  onChange={setSalesData}
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
                  onChange={setCurrentInventory}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-column">
                <label htmlFor="history-days">Inventory Data Days</label>
                <input
                  id="history-days"
                  type="number"
                  min="1"
                  value={inventoryHistoryDays}
                  onChange={(e) => setInventoryHistoryDays(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="form-column">
                <label htmlFor="coverage-days">Coverage Days</label>
                <input
                  id="coverage-days"
                  type="number"
                  min="1"
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
                  type="number"
                  min="0"
                  value={bufferDays}
                  onChange={(e) => setBufferDays(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="form-column">
                <label htmlFor="lead-time">Lead Time</label>
                <input
                  id="lead-time"
                  type="number"
                  min="0"
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
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default DataForm;
