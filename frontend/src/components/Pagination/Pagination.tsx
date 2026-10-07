import "./Pagination.css";

interface PaginationProps {
  totalRows: number;
  rowsPerPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination = ({
  totalRows,
  rowsPerPage,
  setCurrentPage,
}: PaginationProps) => {
  const pages: number[] = [];

  for (let i = 1; i <= Math.ceil(totalRows / rowsPerPage); i++) {
    pages.push(i);
  }

  return (
    <div className="pagination-container">
      {pages.map((page) => {
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className="pagination-btn"
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;
