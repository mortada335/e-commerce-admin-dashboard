import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import i18n from "@/locales/i18n"
import { displayBasicDate } from "@/utils/methods"

export const validatedTop5PurchaseTotalCustomersHeaders = [
  {
    header: () => <div className="text-left uppercase">{i18n.t("Name")}</div>,
    accessorKey: "name",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("phone number")}</div>,

    accessorKey: "username",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("joined date")}</div>,
    accessorKey: "date_joined",

    enableHiding: false,
    cell: ({ row }) => <p className="w-[150px]">{ row.original.date_joined
      ? displayBasicDate( row.original.date_joined)
      : "no date"}</p>
    ,
    
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("OS")}</div>,
    accessorKey: "operating_system",

    enableHiding: false,
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("IP")}</div>,
    accessorKey: "last_login_ip",

    enableHiding: true,
  },
  // {
  //   header: "login time",
  //   accessorKey: "login_time",
  //
  // },
  {
    header: () => <div className="text-left uppercase">{i18n.t("total")}</div>,
    accessorKey: "total_amount",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("Status")}</div>,
    accessorKey: "active",
    cell: ({ row }) => {
      const item = row.original

      return (
        <Badge
          className={cn(
            " rounded-sm",
            item.active
              ? "bg-[#A1FFEE] text-[#127462]"
              : "bg-red-500 text-[#E74C3C] "
          )}
          variant={item.active ? "success" : "destructive"}
        >
          {item.active ? i18n.t("active") : i18n.t("Inactive")}
        </Badge>
      )
    },
  },
]

export const top5CustomerUsersHeaders = [
  {
    header: () => <div className="text-left uppercase">{i18n.t("phone number")}</div>,
    accessorKey: "username",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("Name")}</div>,
    accessorKey: "name",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("joined date")}</div>,
    accessorKey: "date_joined",
    cell: ({ row }) => <p className="w-[150px]">{ row.original.date_joined
      ? displayBasicDate( row.original.date_joined)
      : "no date"}</p>
    ,

  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("OS")}</div>,
    accessorKey: "operating_system",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("IP")}</div>,
    accessorKey: "last_login_ip",
  },
  // {
  //   header: "login time",
  //   accessorKey: "login_time",
  //
  // },
  {
    header: () => <div className="text-left uppercase">{i18n.t("order count")}</div>,
    accessorKey: "order_count",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("Status")}</div>,
    accessorKey: "active",
    cell: ({ row }) => {
      const item = row.original

      return (
        <Badge
          className={cn(
            " rounded-sm",
            item.active
              ? "bg-[#A1FFEE] text-[#127462]"
              : "bg-red-500 text-[#E74C3C] "
          )}
          variant={item.active ? "success" : "destructive"}
        >
          {item.active ? i18n.t("active") : i18n.t("Inactive")}
        </Badge>
      )
    },
  },
]
