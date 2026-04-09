import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  clearSortValue,
  setHistorySortBy,
  setHistorySortType,
  useGeneralCouponStore,
} from "../store"
function HistoryDataTableColumnHeader({ title, className, accessorKey }) {
  const { historySortType, historySortBy } = useGeneralCouponStore()
  const handleSortValue = () => {
    if (historySortType === null) {
      setHistorySortType("desc")
      setHistorySortBy(accessorKey)
    } else if (historySortType === "desc") {
      setHistorySortType("asc")
      setHistorySortBy(accessorKey)
    } else if (historySortType === "asc") {
      clearSortValue()
    }
  }
  return (
    <div
      aria-label={
        historySortType === "desc"
          ? `Sorted descending. Click to sort ascending.`
          : historySortType === "asc"
          ? `Sorted ascending. Click to sort descending.`
          : `Not sorted. Click to sort ascending.`
      }
      className={cn(
        "flex justify-between cursor-pointer  items-center space-x-2 text-left uppercase h-8 px-0 py-1 hover:bg-transparent hover:text-accent-foreground",
        className
      )}
      onClick={handleSortValue}
    >
      <span>{title}</span>
      {accessorKey === historySortBy && historySortType === "desc" ? (
        <ChevronDown className="ml-2 size-4" aria-hidden="true" />
      ) : (
        accessorKey === historySortBy &&
        historySortType === "asc" && (
          <ChevronUp className="ml-2 size-4" aria-hidden="true" />
        )
      )}
    </div>
  )
}

export default HistoryDataTableColumnHeader
