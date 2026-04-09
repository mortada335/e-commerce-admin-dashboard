import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ActionsCell from "./ActionsCell"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import DataTableColumnHeader from "./data-table-column-header"

export default [
  // {
  //   header: () => <div className="text-left capitalize">#id</div>,
  //   accessorKey: "id",
  // },
  {
    header: () => <div className="text-left uppercase">Icon</div>,
    accessorKey: "icon",
    cell: ({ row }) => {
      const item = row.original

      return (
        <Avatar>
          <AvatarImage src={item.icon} alt={item.title} />
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
          title={"title"}
          accessorKey={"title"}
        />
      )
    },
    accessorKey: "title",
  },
  {
    header: () => <div className="text-left uppercase">Type</div>,
    accessorKey: "type",
  },

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"status"}
          accessorKey={"status"}
        />
      )
    },
    accessorKey: "status",
    cell: ({ row }) => {
      const item = row.original

      return (
        <Badge
          className={cn(
            " rounded-sm",
            item.status === 1
              ? "bg-[#A1FFEE] text-[#127462]"
              : "bg-red-500 text-white "
          )}
          variant={item.status === 1 ? "success" : "destructive"}
        >
          {item.status === 1 ? "Enabled" : "Disable"}
        </Badge>
      )
    },
  },
  {
    header: () => <div className="text-left uppercase">Background</div>,
    accessorKey: "bgColor",
    cell: ({ row }) => (
      <div
        className="w-full py-[2px] rounded-sm text-center text-xs px-1"
        style={{ backgroundColor: row.original.bgColor }}
      >
        {row.original.bgColor}
      </div>
    ),
  },

  {
    header: () => <div className="text-left uppercase">Color</div>,
    accessorKey: "color",
    cell: ({ row }) => (
      <div className="w-full h-4" style={{ color: row.original.color }}>
        {row.original.color}
      </div>
    ),
  },
  {
    header: () => <div className="text-left uppercase">Language</div>,
    accessorKey: "language",
    cell: ({ row }) => (
      <p className="">
        {row.original.language === 2
          ? "Arabic"
          : row.original.language === 3
          ? "Kurdish"
          : "English"}
      </p>
    ),
  },

  {
    header: () => <div className="text-left uppercase">Category</div>,
    accessorKey: "category_name",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"dateAdded"}
          accessorKey={"date_Added"}
        />
      )
    },
    accessorKey: "dateAdded",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Modified"}
          accessorKey={"date_modified"}
        />
      )
    },
    accessorKey: "dateModified",
  },

  {
    header: () => <div className="text-left uppercase">Actions</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
]
