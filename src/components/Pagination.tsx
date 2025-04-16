"use client";

type PaginationProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onNextPage: () => void;
  readonly onPreviousPage: () => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
}: PaginationProps) {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={onPreviousPage}
        disabled={currentPage === 1}
        className="px-2 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className="px-2 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
