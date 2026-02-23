import { Button } from "@/components/Button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => onPageChange(currentPage - 1);
  const handleNext = () => onPageChange(currentPage + 1);

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="mt-6 flex items-center justify-center gap-4"
    >
      <Button
        onClick={handlePrevious}
        dataTestId="pagination-prev"
        ariaLabel="Go to previous page"
        disabled={currentPage <= 1}
      >
        Previous
      </Button>
      <span
        className="text-sm text-gray-600 dark:text-gray-400"
        aria-live="polite"
      >
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={handleNext}
        dataTestId="pagination-next"
        ariaLabel="Go to next page"
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </nav>
  );
};
