import "./DialogResults.css";
import type { InventoryReportItem } from "../../types/inventory";
import Pagination from "../Pagination/Pagination";
import ExportOptions from "../ExportOptions/ExportOptions";

interface DialogResultsProps {
  handleOpenCloseDialog: () => void;
  data: InventoryReportItem[];
  reportItems: InventoryReportItem[];
  reportId: string;
  totalRows: number;
  rowsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const numberFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 2,
});

const DialogResults = ({
  handleOpenCloseDialog,
  data,
  reportItems,
  reportId,
  totalRows,
  rowsPerPage,
  currentPage,
  setCurrentPage,
}: DialogResultsProps) => {
  const itemsToReplenish = reportItems.filter(
    (item) => item["CANTIDAD A ORDENAR"] > 0,
  ).length;
  const totalUnitsToOrder = reportItems.reduce(
    (total, item) => total + item["CANTIDAD A ORDENAR"],
    0,
  );

  return (
    <section className="results-container" aria-labelledby="results-title">
      <header className="report-header">
        <div>
          <span className="report-eyebrow">STOCKSENSE · REPORTE</span>
          <h1 id="results-title">Resultados del análisis</h1>
          <p>
            Resumen de existencias y recomendaciones para tus próximos pedidos.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCloseDialog}
          className="results-close"
          aria-label="Cerrar resultados"
        >
          ×
        </button>
      </header>

      <section className="report-summary" aria-label="Resumen del análisis">
        <article className="summary-card">
          <span className="summary-label">Artículos analizados</span>
          <strong className="summary-value">
            {numberFormatter.format(totalRows)}
          </strong>
          <span className="summary-caption">en total</span>
        </article>
        <article className="summary-card summary-card--blue">
          <span className="summary-label">Requieren reposición</span>
          <strong className="summary-value">
            {numberFormatter.format(itemsToReplenish)}
          </strong>
          <span className="summary-caption">artículos</span>
        </article>
        <article className="summary-card summary-card--accent">
          <span className="summary-label">Unidades sugeridas</span>
          <strong className="summary-value">
            {numberFormatter.format(totalUnitsToOrder)}
          </strong>
          <span className="summary-caption">para reabastecer</span>
        </article>
      </section>

      <div className="report-toolbar">
        <div>
          <h2>Detalle de productos</h2>
          <p>Las cantidades recomendadas aparecen destacadas en azul.</p>
        </div>
        <ExportOptions reportId={reportId} data={reportItems} />
      </div>

      <div
        className="results-table-scroll"
        role="region"
        aria-label="Tabla de resultados de inventario"
        tabIndex={0}
      >
        <table className="table-results">
          <caption className="sr-only">
            Existencias y recomendaciones de reposición por producto
          </caption>
          <thead>
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Descripción</th>
              <th scope="col" className="number-cell">
                Existencia
              </th>
              <th scope="col" className="number-cell">
                Demanda mensual
              </th>
              <th scope="col" className="number-cell">
                Punto de reorden
              </th>
              <th scope="col" className="number-cell">
                Cantidad a ordenar
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => {
                const quantityToOrder = item["CANTIDAD A ORDENAR"];

                return (
                  <tr key={`${item.CODIGO}-${index}`}>
                    <td className="code-cell">{item.CODIGO}</td>
                    <td className="description-cell">
                      {item.DESCRIPCION?.trim()}
                    </td>
                    <td className="number-cell">
                      {numberFormatter.format(item.EXISTENCIA)}
                    </td>
                    <td className="number-cell">
                      {numberFormatter.format(item["DEMANDA MENSUAL"])}
                    </td>
                    <td className="number-cell">
                      {numberFormatter.format(item["PUNTO DE REORDEN"])}
                    </td>
                    <td className="number-cell">
                      <span
                        className={`order-quantity ${
                          quantityToOrder > 0
                            ? "order-quantity--needed"
                            : "order-quantity--none"
                        }`}
                      >
                        {numberFormatter.format(quantityToOrder)}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="empty-results">
                  No hay resultados disponibles para mostrar.
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
      <p className="report-footnote">
        Las recomendaciones son estimaciones basadas en los archivos y
        parámetros proporcionados.
      </p>
    </section>
  );
};

export default DialogResults;
