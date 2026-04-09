import { ChevronDown, ChevronUp, ArrowDownUp, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function DataTableColumnHeader({ column, title, className }) {
  if (!column?.getCanSort()) {
    return <div className={cn('uppercase',className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center space-x-2 uppercase", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={
              column.getIsSorted() === "desc"
                ? `Sorted descending. Click to sort ascending.`
                : column.getIsSorted() === "asc"
                ? `Sorted ascending. Click to sort descending.`
                : `Not sorted. Click to sort ascending.`
            }
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span className="uppercase">{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 size-4" aria-hidden="true" />
            ) : column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 size-4" aria-hidden="true" />
            ) : (
              <ArrowDownUp className="ml-2 size-4" aria-hidden="true" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            aria-label="Sort ascending"
            onClick={() => column.toggleSorting(false)}
          >
            <ChevronUp
              className="mr-2 size-3.5 text-muted-foreground/70"
              aria-hidden="true"
            />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem
            aria-label="Sort descending"
            onClick={() => column.toggleSorting(true)}
          >
            <ChevronDown
              className="mr-2 size-3.5 text-muted-foreground/70"
              aria-hidden="true"
            />
            Desc
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator />
          <DropdownMenuItem
            aria-label="Hide column"
            onClick={() => column.toggleVisibility(false)}
          >
          
            <EyeOff
              className="mr-2 size-3.5 text-muted-foreground/70"
              aria-hidden="true"
            />
            Hide
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default DataTableColumnHeader
