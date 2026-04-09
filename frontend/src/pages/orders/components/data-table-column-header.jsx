import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  clearSortValue,
  setSortBy,
  setSortType,
  useOrderStore,
} from "../store";
function DataTableColumnHeader({ title, className, accessorKey }) {
  const { sortType, sortBy } = useOrderStore();
  const handleSortValue = () => {
    if (sortType === null) {
      setSortType("desc");
      setSortBy(accessorKey);
    } else if (sortType === "desc") {
      setSortType("asc");
      setSortBy(accessorKey);
    } else if (sortType === "asc") {
      clearSortValue();
    }
  };
  return (
    <div
      aria-label={
        sortType === "desc"
          ? `Sorted descending. Click to sort ascending.`
          : sortType === "asc"
          ? `Sorted ascending. Click to sort descending.`
          : `Not sorted. Click to sort ascending.`
      }
      className={cn(
        "flex justify-between cursor-pointer items-center space-x-2 text-left uppercase h-8 px-0 py-1 hover:bg-transparent hover:text-accent-foreground",
        className
      )}
      onClick={handleSortValue}
    >
      <span>{title}</span>
      {accessorKey === sortBy && sortType === "desc" ? (
        <ChevronDown className="ml-2 size-4" aria-hidden="true" />
      ) : (
        accessorKey === sortBy &&
        sortType === "asc" && (
          <ChevronUp className="ml-2 size-4" aria-hidden="true" />
        )
      )}
    </div>
  );
}

export default DataTableColumnHeader;
