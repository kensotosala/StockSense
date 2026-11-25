import "./Pagination.css";

interface PaginationProps {
  totalRows: number;
  rowsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination = ({
  totalRows,
  rowsPerPage,
  currentPage,
  setCurrentPage,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  if (totalPages <= 1) return null;

  const firstRow = (currentPage - 1) * rowsPerPage + 1;
  const lastRow = Math.min(currentPage * rowsPerPage, totalRows);

  return (
    <nav className="pagination-container" aria-label="Paginación del reporte">
      <p className="pagination-summary">
        Mostrando <strong>{firstRow}-{lastRow}</strong> de{" "}
        <strong>{totalRows}</strong> artículos
      </p>
      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="pagination-current" aria-current="page">
          Página {currentPage} de {totalPages}
        </span>
        <button
          type="button"
          className="pagination-btn"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
