import { useState } from "react";
import "./ExportOptions.css";
import {
  DownloadCSVReport,
  DownloadPDFReport,
} from "../../services/ExportService";
import type { InventoryReportItem } from "../../types/inventory";

interface ExportOptionsProps {
  reportId: string;
  data: InventoryReportItem[];
}

const ExportOptions = ({ reportId, data }: ExportOptionsProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!reportId) {
      setError("No se encontró el identificador del reporte.");
      return;
    }

    try {
      setIsExporting(true);
      setError(null);

      await DownloadPDFReport(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "No se pudo generar el PDF.";

      setError(message);
      console.error("Error al exportar PDF:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    if (!reportId) {
      setError("No se encontró el identificador del reporte.");
      return;
    }

    try {
      setIsExporting(true);
      setError(null);

      await DownloadCSVReport(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "No se pudo generar el CSV.";
      setError(message);
      console.error("Error al exportar CSV:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="export-options-container">
      <button
        type="button"
        className="option option-pdf"
        onClick={handleExportPDF}
        disabled={isExporting}
      >
        {isExporting ? "Generando PDF..." : "Exportar a PDF"}
      </button>

      {error && <p role="alert">{error}</p>}

      <button
        type="button"
        className="option option-pdf"
        onClick={handleExportCSV}
        disabled={isExporting}
      >
        {isExporting ? "Generando CSV..." : "Exportar a CSV"}
      </button>
    </div>
  );
};

export default ExportOptions;
