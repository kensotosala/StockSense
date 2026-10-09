import "./ExportOptions.css";

interface ExportOptionsProps {
  onExportPdf: () => void;
  isExportingPdf: boolean;
}

const ExportOptions = ({ onExportPdf, isExportingPdf }: ExportOptionsProps) => {
  return (
    <div className="export-options-container">
      <button
        type="button"
        className="option option-pdf"
        onClick={onExportPdf}
        disabled={isExportingPdf}
      >
        {isExportingPdf ? "Generando PDF..." : "PDF"}
      </button>

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
