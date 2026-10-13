import "./Pagination.css";

interface PaginationProps {
  totalRows: number;
  rowsPerPage: number;
  currentPage: number; // Agregado para identificar la página activa
  setCurrentPage: (page: number) => void;
}

const Pagination = ({
  totalRows,
  rowsPerPage,
  currentPage,
  setCurrentPage,
}: PaginationProps) => {
  const pages: number[] = [];
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      {pages.map((page) => {
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            // Aplica la clase 'active' si es la página actual
            className={`pagination-btn ${page === currentPage ? "active" : ""}`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;
