import { useEffect, useState } from "react";
import "./DialogResults.css";
import type { InventoryReportItem } from "../../types/inventory";
import Pagination from "../Pagination/Pagination";
import ExportOptions from "../ExportOptions/ExportOptions";
import { DownloadPDFReport } from "../../services/ExportService";

interface DialogResultsProps {
  handleOpenCloseDialog: () => void;
  data: InventoryReportItem[];
  totalRows: number;
  rowsPerPage: number;
  setCurrentPage: (page: number) => void;

  sells: File;
  actualInventory: File;
  inventoryHistoryDays: number;
  coverageDays: number;
  bufferDays: number;
  leadTime: number;
}

const DialogResults = ({
  handleOpenCloseDialog,
  data,
  totalRows,
  rowsPerPage,
  setCurrentPage,
  sells,
  actualInventory,
  inventoryHistoryDays,
  coverageDays,
  bufferDays,
  leadTime,
}: DialogResultsProps) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Datos recibidos del backend:", data);
  }, [data]);

  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      setExportError(null);

      await DownloadPDFReport({
        sells,
        actualInventory,
        inventoryHistoryDays,
        coverageDays,
        bufferDays,
        leadTime,
      });
    } catch (error) {
      setExportError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al exportar el PDF.",
      );
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="form-container">
      <div className="wrapper-btn-close">
        <button onClick={handleOpenCloseDialog} className="btn-close">
          X
        </button>
      </div>

      <h2>Resultados del Análisis</h2>

      <ExportOptions
        onExportPdf={handleExportPdf}
        isExportingPdf={isExportingPdf}
      />

      {exportError && (
        <p role="alert" className="export-error">
          {exportError}
        </p>
      )}

      <div style={{ overflowX: "auto", marginTop: "1rem" }}>
        <table className="table-results">
          <thead className="table-head">
            <tr>
              <th className="th-codigo">Código</th>
              <th>Descripción</th>
              <th className="th-existencia">Existencia</th>
              <th className="th-demanda-mensual">Demanda Mensual</th>
              <th className="th-punto-reorden">Punto Reorden</th>
              <th className="th-cantidad-ordenar">Cant. A Ordenar</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.CODIGO || index}>
                <td>{item.CODIGO}</td>
                <td>{item.DESCRIPCION}</td>
                <td className="td-existencia">{item.EXISTENCIA}</td>
                <td className="td-demanda-mensual">
                  {item["DEMANDA MENSUAL"]}
                </td>
                <td className="td-punto-reorden">{item["PUNTO DE REORDEN"]}</td>
                <td className="td-cant-ordenar">
                  <strong>{item["CANTIDAD A ORDENAR"]}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        totalRows={totalRows}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default DialogResults;
