import {
  ChevronsRight,
  ChevronsLeft,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useTranslation } from "react-i18next";

function Pagination({
  totalCount = 0,
  next,
  previous,
  totalPages,
  page,
  setPage,
  itemPerPage = 25,
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pagesToShow = isDesktop ? 10 : 3; // Number of pages to show at a time
  const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);

  const {t,i18n } = useTranslation()
  // Calculate the start and end index of the pages to display
  const startIndex = Math.max(0, page - Math.floor(pagesToShow / 2));
  const endIndex = Math.min(startIndex + pagesToShow, totalPages);

  // Generate the array of page numbers to display
  const displayedPages = pagesArray.slice(startIndex, endIndex);

  return (
    <div className="whitespace-nowrap text-sm text-muted-foreground w-full px-4 flex flex-col justify-between items-center gap-4 lg:ltr:flex-row lg:rtl:flex-row-reverse sm:gap-6 lg:gap-8">
      <p className="text-sm text-medium mb-0 flex justify-start items-center space-x-1">
        <span>{t("Showing")}</span> <span>{itemPerPage * (page - 1) + 1}</span>{" "}
        <span>{t("to")}</span>
        <span>
          {Math.min(itemPerPage * page, totalCount)} {t('of')} {totalCount}
        </span>
        <span>{t("entries")}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          aria-label="Go to first page"
          variant="outline"
          className="hidden size-8 p-0 lg:flex"
          onClick={() => {
            setPage(page <= 10 ? 1 : page - 10);
          }}
          disabled={!previous || page <= 10}
        >
          {i18n.language === 'ar' ? (
            <ChevronsRight size={16} aria-hidden="true" />
          ) : (
            <ChevronsLeft size={16} aria-hidden="true" />
          )}
        </Button>
        <Button
          aria-label="Go to previous page"
          variant="outline"
          className="size-8 p-0"
          onClick={() => setPage(page - 1)}
          disabled={!previous}
        >
          {i18n.language === 'ar' ? (
            <ChevronRight size={16} aria-hidden="true" />
          ) : (
            <ChevronLeft size={16} aria-hidden="true" />
          )}
        </Button>

        {/* Display ellipsis icon if there are more pages before the displayed range */}
        {startIndex > 0 && <MoreHorizontal size={16} aria-hidden="true" />}

        {displayedPages.map((pageNumber) => (
          <Button
            key={pageNumber}
            aria-label={`Go to page ${pageNumber}`}
            variant="outline"
            className="size-8 p-0"
            onClick={() => setPage(pageNumber)}
            disabled={page === pageNumber}
          >
            {pageNumber}
          </Button>
        ))}

        {/* Display ellipsis icon if there are more pages after the displayed range */}
        {endIndex < totalPages && (
          <MoreHorizontal size={16} aria-hidden="true" />
        )}

        <Button
          aria-label="Go to next page"
          variant="outline"
          className="size-8 p-0"
          onClick={() => setPage(page + 1)}
          disabled={!next}
        >
          {i18n.language === 'ar' ? (
            <ChevronLeft size={16} aria-hidden="true" />
          ) : (
            <ChevronRight size={16} aria-hidden="true" />
          )}
        </Button>
        <Button
          aria-label="Go to last page"
          variant="outline"
          className="hidden size-8 p-0 lg:flex"
          onClick={() => setPage(totalPages)}
          disabled={!next}
        >
          {i18n.language === 'ar' ? (
            <ChevronsLeft size={16} aria-hidden="true" />
          ) : (
            <ChevronsRight size={16} aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
