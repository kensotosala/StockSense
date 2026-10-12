import { useState } from "react";
import "./ExportOptions.css";
import { DownloadPDFReport } from "../../services/ExportService";

interface ExportOptionsProps {
  reportId: string;
}

const ExportOptions = ({ reportId }: ExportOptionsProps) => {
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

      await DownloadPDFReport(reportId);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "No se pudo generar el PDF.";

      setError(message);
      console.error("Error al exportar PDF:", err);
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
        className="option option-csv"
        disabled
        title="Exportación CSV pendiente de implementar"
      >
        CSV
      </button>
    </div>
  );
};

export default ExportOptions;
