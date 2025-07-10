"use client";

const PaginationCard = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex justify-center">
      <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        {currentPage > 1 && (
          <PaginationButton
            direction="previous"
            onClick={() => onPageChange(currentPage - 1)}
          />
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationButton
            key={page}
            page={page}
            isActive={currentPage === page}
            onClick={() => onPageChange(page)}
          />
        ))}

        {currentPage < totalPages && (
          <PaginationButton
            direction="next"
            onClick={() => onPageChange(currentPage + 1)}
          />
        )}
      </nav>
    </div>
  );
};

const PaginationButton = ({ page, isActive, direction, onClick }) => {
  const classNames = `relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
    isActive
      ? "z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-gray-700 dark:text-white"
      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
  }`;

  if (direction) {
    return (
      <button
        onClick={onClick}
        className={`${classNames} ${direction === 'previous' ? 'rounded-l-md px-2' : 'rounded-r-md px-2'}`}
      >
        <span className="sr-only">{direction === 'previous' ? 'Previous' : 'Next'}</span>
        <PaginationIcon direction={direction} />
      </button>
    );
  }

  return (
    <button onClick={onClick} className={classNames}>
      {page}
    </button>
  );
};

const PaginationIcon = ({ direction }) => (
  <svg
    className="h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d={direction === 'previous' 
        ? "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
        : "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"}
      clipRule="evenodd"
    />
  </svg>
);

export default PaginationCard;