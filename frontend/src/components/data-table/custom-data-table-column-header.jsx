import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";



function CustomDataTableColumnHeader({
  title,
  className,
  accessorKey,
  canSort = true,
  useStore,
  setSortBy,
  setSortType,
  clearSortValue
}) {

  const { sortType, sortBy } = useStore();
  const handleSortValue = () => {
    if (canSort) {
      if (sortType === null) {
        setSortType("desc");
        setSortBy(accessorKey);
      } else if (sortType === "desc") {
        setSortType("asc");
        setSortBy(accessorKey);
      } else if (sortType === "asc") {
        clearSortValue();
      }
    }
  };
  return (
    <div
      className={cn(
        "flex  items-center w-full ",
        ""
      )}
    >
      <Button
        aria-label={
          sortType === "desc"
            ? `Sorted descending. Click to sort ascending.`
            : sortType === "asc"
            ? `Sorted ascending. Click to sort descending.`
            : `Not sorted. Click to sort ascending.`
        }
        variant="ghost"
        className={cn(
          "flex justify-between items-center !text-sm gap-2 text-left uppercase h-8 px-0 py-1 hover:bg-transparent hover:text-accent-foreground",
          className
        )}
        onClick={handleSortValue}
      >
        <span>{title}</span>
        {canSort && accessorKey === sortBy && sortType === "desc" ? (
          <ChevronDown className="ml-2 size-4" aria-hidden="true" />
        ) : (
          accessorKey === sortBy &&
          sortType === "asc" && (
            <ChevronUp className="ml-2 size-4" aria-hidden="true" />
          )
        )}
      </Button>
    </div>
  );
}

export default CustomDataTableColumnHeader;
