

import ActionsCell from "./ActionsCell";



import { clearSortValue, setSortBy, setSortType, useWalletTransactionsStore } from "../store";


import { customFormatDate, formatNumberWithCurrency, formatText } from "@/utils/methods";
import CustomDataTableColumnHeader from "@/components/data-table/custom-data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BadgeAlert, BadgeCheck, BadgeMinus, BadgePlus } from "lucide-react";
import i18n from "@/locales/i18n";

export default [

  {
    header: ({ column }) => {
      return (
        <CustomDataTableColumnHeader
          useStore={useWalletTransactionsStore}
                    setSortType={setSortType}
          setSortBy={setSortBy}
          clearSortValue={clearSortValue}
          column={column}
          title={i18n.t("User Id")}
          accessorKey={"user"}
        />
      );
    },
    accessorKey: "user",
  },
  {
    header: ({ column }) => {
      return (
        <CustomDataTableColumnHeader
          useStore={useWalletTransactionsStore}
                    setSortType={setSortType}
          setSortBy={setSortBy}
          clearSortValue={clearSortValue}
          column={column}
          title={i18n.t("Amount IQD")}
          accessorKey={"amount_iqd"}
        />
      );
    },
    accessorKey: "amount_iqd",
      cell: ({ row }) => <p>{formatNumberWithCurrency(row.original?.amount_iqd,'IQD')}</p>,
  },
    {
    header: ({ column }) => {
      return (
        <CustomDataTableColumnHeader
          useStore={useWalletTransactionsStore}
                    setSortType={setSortType}
          setSortBy={setSortBy}
          clearSortValue={clearSortValue}
          column={column}
          title={i18n.t("Payment Status")}
          accessorKey={"payment_status"}
        />
      );
    },
    accessorKey: "payment_status",
    cell: ({ row }) => {
      const item = row.original;

      return (
 
            <div className="w-full flex justify-start items-center gap-2">
              <Badge
                className={cn(
                  " rounded-sm  text-white uppercase !text-xs ",
                  item.payment_status === 'completed' 
                    ? "bg-green-500 hover:bg-green-400"
                    : item.payment_status === 'pending'
                    ? "bg-yellow-500 hover:bg-yellow-400"
                    : item.payment_status === 'failed'
                    ? "bg-red-500 hover:bg-red-400"
                    : "bg-blue-500 hover:bg-blue-400"
                )}
              >
                {item.payment_status === 'completed' ? (
                  <BadgeCheck size={16} />
                ) :item.payment_status === 'pending' ? (
                  <BadgeAlert size={16} />
                ) : item.payment_status === 'failed' ? (
                  <BadgeMinus size={16} />
                ) : (
                  <BadgePlus size={16} />
                )}
              </Badge>
              <span>{formatText(item.payment_status||'')}</span>
            </div>
           
      );
    },
  },



  {
    header: ({ column }) => {
      return (
        <CustomDataTableColumnHeader
          useStore={useWalletTransactionsStore}
                    setSortType={setSortType}
          setSortBy={setSortBy}
          clearSortValue={clearSortValue}
          column={column}
          title={i18n.t("completed date")}
          accessorKey={"completed_at"}
        />
      );
    },
    accessorKey: "completed_at",
    cell: ({ row }) => <p>{customFormatDate(row.original?.completed_at,true)}</p>,
  },
  {
    header: ({ column }) => {
      return (
        <CustomDataTableColumnHeader
          useStore={useWalletTransactionsStore}
          setSortType={setSortType}
          setSortBy={setSortBy}
          clearSortValue={clearSortValue}
          column={column}
          title={i18n.t("created date")}
          accessorKey={"created_at"}
        />
      );
    },
    accessorKey: "created_at",
    cell: ({ row }) => <p>{customFormatDate(row.original?.created_at,true)}</p>,
  },

  {
     header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
];
