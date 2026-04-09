import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ActionsCell from "./ActionsCell"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import DataTableColumnHeader from "./data-table-column-header"
import { resolveAppIconPlatform } from "@/utils/methods"
import i18n from "@/locales/i18n"

export default [
  {
    header: () => <div className="text-left capitalize">{i18n.t("#id")}</div>,
    accessorKey: "id",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("name")}
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
          title={i18n.t("platform")}
          accessorKey={"platform"}
        />
      )
    },
    accessorKey: "platform",
    cell: ({ row }) => {
      const item = row.original

      return (
        <Badge
          className={cn(
            " rounded-sm")}
            
         
        >
          {resolveAppIconPlatform(item.platform)}
        </Badge>
      )
    },
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Status")}
          accessorKey={"is_active"}
        />
      )
    },
    accessorKey: "is_active",
    cell: ({ row }) => {
      const item = row.original

      return (
        <Badge
          className={cn(
            " rounded-sm",
            item.is_active
              ? "bg-[#A1FFEE] text-[#127462]"
              : "bg-red-500 text-white "
          )}
          variant={item.is_active ? "success" : "destructive"}
        >
          {item.is_active ? i18n.t("Enabled") : i18n.t("Disable")}
        </Badge>
      )
    },
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
]
