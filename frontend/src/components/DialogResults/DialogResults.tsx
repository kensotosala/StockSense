import "./DialogResults.css";
import type { InventoryReportItem } from "../../types/inventory";
import Pagination from "../Pagination/Pagination";
import ExportOptions from "../ExportOptions/ExportOptions";

interface DialogResultsProps {
  handleOpenCloseDialog: () => void;
  data: InventoryReportItem[];
  reportId: string;
  totalRows: number;
  rowsPerPage: number;
  currentPage: number; // Agregado para controlar el estado de la paginación activa
  setCurrentPage: (page: number) => void;
}

const DialogResults = ({
  handleOpenCloseDialog,
  data,
  reportId,
  totalRows,
  rowsPerPage,
  currentPage,
  setCurrentPage,
}: DialogResultsProps) => {
  const dataTable = Array.isArray(data) ? data : [];

  return (
    <div className="form-container">
      <div className="wrapper-btn-close">
        <button
          type="button"
          onClick={handleOpenCloseDialog}
          className="btn-close"
        >
          X
        </button>
      </div>

      <h2>Resultados del Análisis</h2>

      <ExportOptions reportId={reportId} data={data} />

      <div style={{ overflowX: "auto", width: "100%", marginTop: "1rem" }}>
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
            {dataTable.length > 0 ? (
              dataTable.map((item, index) => (
                <tr key={`${item.CODIGO}-${index}`}>
                  <td>{item.CODIGO}</td>
                  <td>{item.DESCRIPCION?.trim()}</td>
                  <td className="td-existencia">{item.EXISTENCIA}</td>
                  <td className="td-demanda-mensual">
                    {item["DEMANDA MENSUAL"]}
                  </td>
                  <td className="td-punto-reorden">
                    {item["PUNTO DE REORDEN"]}
                  </td>
                  <td className="td-cant-ordenar">
                    <strong>{item["CANTIDAD A ORDENAR"]}</strong>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  No hay resultados disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalRows={totalRows}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default DialogResults;
