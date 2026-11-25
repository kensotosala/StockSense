import React, { useState } from "react";
import CustomInputFile from "../custom-input-file/customInputFile";
import "./InventoryDataForm.css";
import { submitInventoryData } from "../../services/InventoryService";
import type { InventoryReportResponse } from "../../types/inventory";
import DialogResults from "../DialogResults/DialogResults";
import { useAuth } from "../../../contexts/AuthContext";

interface DataFormProps {
  handleToggleDialog: () => void;
}

const DataForm = ({ handleToggleDialog }: DataFormProps) => {
  const { token } = useAuth();
  const [salesData, setSalesData] = useState<File | null>(null);
  const [currentInventory, setCurrentInventory] = useState<File | null>(null);

  const [inventoryHistoryDays, setInventoryHistoryDays] = useState("");
  const [coverageDays, setCoverageDays] = useState("");
  const [bufferDays, setBufferDays] = useState("");
  const [leadTime, setLeadTime] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [openResultsDialog, setOpenResultsDialog] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [reportData, setReportData] = useState<InventoryReportResponse | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(25);

  const lastPostIndex = currentPage * rowsPerPage;
  const firstPostIndex = lastPostIndex - rowsPerPage;

  const currentData =
    reportData?.items.slice(firstPostIndex, lastPostIndex) ?? [];

  const handleToggleResultsDialog = () => {
    setOpenResultsDialog((prev) => !prev);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!salesData || !currentInventory) {
      setFormError("Selecciona los archivos de ventas e inventario para continuar.");
      return;
    }

    setFormError(null);
    setIsLoading(true);

    try {
      const report = await submitInventoryData({
        sells: salesData,
        actualInventory: currentInventory,
        inventoryHistoryDays,
        coverageDays,
        bufferDays,
        leadTime,
      }, token);

      setReportData(report);
      setCurrentPage(1);
      setOpenResultsDialog(true);
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      setFormError(
        error instanceof Error
          ? error.message
          : "No se pudieron procesar los datos. Inténtalo de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div
          className="flex flex-col items-center gap-4 rounded-2xl bg-white p-10 text-center shadow-xl"
          role="status"
          aria-live="polite"
        >
          <div className="spinner" />
          <p className="font-semibold text-slate-700">
            Analizando tus datos. Esto puede tardar un momento...
          </p>
        </div>
      ) : openResultsDialog && reportData ? (
        <DialogResults
          data={currentData}
          reportItems={reportData.items}
          reportId={reportData.report_id}
          handleOpenCloseDialog={handleToggleResultsDialog}
          totalRows={reportData.items.length}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
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

          <h2 className="mb-2 text-2xl font-bold">Datos para el análisis</h2>
          <p className="mb-5 text-center text-sm text-slate-600">
            Sube ambos archivos e indica los días del historial de ventas y de
            cobertura. Los días de reserva y entrega pueden dejarse en 0.
          </p>

          <form onSubmit={handleSubmit} className="data-form">
            <div className="form-row">
              <div className="form-column">
                <CustomInputFile
                  label_text="Ventas (CSV) *"
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
                  label_text="Inventario actual (CSV) *"
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
                <label htmlFor="history-days">
                  Días del historial de ventas *
                </label>
                <input
                  id="history-days"
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={inventoryHistoryDays}
                  onChange={(e) => setInventoryHistoryDays(e.target.value)}
                  disabled={isLoading}
                />
                <span className="text-xs text-slate-500">
                  Número de días representados por el archivo de ventas.
                </span>
              </div>

              <div className="form-column">
                <label htmlFor="coverage-days">Días de cobertura *</label>
                <input
                  id="coverage-days"
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={coverageDays}
                  onChange={(e) => setCoverageDays(e.target.value)}
                  disabled={isLoading}
                />
                <span className="text-xs text-slate-500">
                  Cuántos días de demanda quieres cubrir.
                </span>
              </div>
            </div>

            <div className="form-row">
              <div className="form-column">
                <label htmlFor="buffer-days">Días de reserva</label>
                <input
                  id="buffer-days"
                  type="number"
                  min="0"
                  step="1"
                  value={bufferDays}
                  onChange={(e) => setBufferDays(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="form-column">
                <label htmlFor="lead-time">Tiempo de entrega (días)</label>
                <input
                  id="lead-time"
                  type="number"
                  min="0"
                  step="1"
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {formError && (
              <p role="alert" className="text-sm font-medium text-red-700">
                {formError}
              </p>
            )}

            <div className="flex flex-col items-center mt-5">
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-950 p-4 font-bold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:min-w-64"
                disabled={isLoading}
              >
                Generar análisis
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default DataForm;
