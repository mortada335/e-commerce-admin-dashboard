/* eslint-disable react/prop-types */
// ProductsList page components

import { customFormatDate, formatFullDate } from "@/utils/methods";
import ActionsCell from "./ActionsCell";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import i18n from "@/locales/i18n";

// Images

export default [
  {
    header: () => <div className="text-left capitalize">{i18n.t("#id")}</div>,
    accessorKey: "id",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("title")}</div>,
    accessorKey: "title",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("body")}</div>,

    accessorKey: "body",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("Send Date")}</div>,

    accessorKey: "send_at",
    cell: ({ row }) => <p>{formatFullDate(row.original?.send_at,true)}</p>,
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("Is approved by admin")}</div>,

    accessorKey: "is_approved_by_admin",
     cell: ({ row }) => {
      const item = row.original;

      return (
        <Badge
          className={cn(
            " rounded-sm",
            item.is_approved_by_admin
              ? "bg-[#A1FFEE] text-[#127462]"
              : "bg-red-500 text-white "
          )}
          variant={item.is_approved_by_admin ? "success" : "destructive"}
        >
          {item.is_approved_by_admin ? i18n.t("Yes") : i18n.t("No")}
        </Badge>
      );
    },
  },
   {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
]
