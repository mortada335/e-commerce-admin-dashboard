import {
  ChevronsRight,
  ChevronsLeft,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useTranslation } from "react-i18next"
import i18n from "@/locales/i18n"

function DataTablePagination({
  table,
  pageSizeOptions = [5, 10, 20, 30, 40, 50],
}) {
  const {t} = useTranslation()
  return (
    <div className="flex w-full items-center justify-between gap-4 overflow-auto px-2 py-1 flex-row sm:gap-8">
      <div className=" whitespace-nowrap text-sm text-muted-foreground flex items-center w-full gap-4 flex-row sm:gap-6 lg:gap-8">
        {/* {table.getFilteredSelectedRowModel().rows.length} of{" "} */}
        {/* {table.getFilteredRowModel().rows.length} row(s) selected. */}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {t("Page")} {table.getState().pagination.pageIndex + 1} {t("of")}{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label="Go to first page"
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft size={16} aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to previous page"
            variant="outline"
            className="size-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </Button>

          <Button
            aria-label="Go to next page"
            variant="outline"
            className="size-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={16} aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to last page"
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 flex-row ">
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap text-sm font-medium">
            {t("Entries per page")}
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t("Columns")} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {i18n.t(column.id)}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default DataTablePagination
