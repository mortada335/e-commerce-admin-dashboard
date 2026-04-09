import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ActionsCell from "./ActionsCell"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import DataTableColumnHeader from "./data-table-column-header"

export default [
  {
    header: () => <div className="text-left capitalize">#id</div>,
    accessorKey: "manufacturer_id",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"name"}
          accessorKey={"name"}
        />
      )
    },
    accessorKey: "name",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Index"}
          accessorKey={"sort_order"}
        />
      )
    },
    accessorKey: "sort_order",
  },
  {
    header: () => <div className="text-left uppercase">Image</div>,
    accessorKey: "image",
    cell: ({ row }) => {
      const item = row.original

      return (
        <Avatar>
          <AvatarImage src={item.image} alt={item.name} />
          <AvatarFallback>{item.id}</AvatarFallback>
        </Avatar>
      )
    },
  },

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Status"}
          accessorKey={"enabled"}
        />
      )
    },
    accessorKey: "enabled",
    cell: ({ row }) => {
      const item = row.original

      return (
        <Badge
          className={cn(
            " rounded-sm",
            item.enabled
              ? "bg-[#A1FFEE] text-[#127462]"
              : "bg-red-500 text-white "
          )}
          variant={item.enabled ? "success" : "destructive"}
        >
          {item.enabled ? "Enabled" : "Disable"}
        </Badge>
      )
    },
  },
  {
    header: () => <div className="text-left uppercase">Actions</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
]
