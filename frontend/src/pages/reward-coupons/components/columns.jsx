import Text from "@/components/layout/text";
import ActionsCell from "./ActionsCell";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatNumberWithCurrency } from "@/utils/methods";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DataTableColumnHeader from "./data-table-column-header";
import i18n from "@/locales/i18n";

export default [
  // {
  //   header: () => <div className="text-left capitalize">#id</div>,
  //   accessorKey: "id",
  // },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("name")}
          accessorKey={"name"}
        />
      );
    },
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("code")}</div>,
    accessorKey: "code",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("discount")}
          accessorKey={"discount"}
        />
      );
    },
    accessorKey: "discount",
    cell: ({ row }) => {
  
      return (
        <Text
          text={
            row?.original?.type === "P" || row?.original?.type === "X"
              ? `${Number(row?.original?.discount)?.toFixed(2)} %`
              : formatNumberWithCurrency(String(row?.original?.discount), "IQD")
          }
        />
      );
    },
  },

  // {
  //   header: () => <div className="text-left uppercase">type</div>,
  //   accessorKey: "type",
  //   cell: ({ row }) => {
  //     const item = row.original

  //     return (
  //       <Badge
  //         className={cn(" rounded-sm bg-[#A1FFEE] text-[#127462]")}
  //         variant="success"
  //       >
  //         {item.type === 0 ? "General" : item.type === 1 ? "Points" : "Other"}
  //       </Badge>
  //     )
  //   },
  // },


  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Status")}
          accessorKey={"status"}
        />
      );
    },
    accessorKey: "status",
    cell: ({ row }) => {
      /* 
        Promo code status is a 3 type of numbers, each represent a value:
         1. Status: 0 -> Promo-code 'Disabled'
         2. Status: 1 -> Promo-code 'Enabled'
         3. Status: 2 -> Promo-code 'Expired'
      */

      const item = row?.original;

      const disabled = item.status === 0;
      const enabled = item.status === 1;
      const expired = item.status === 2;

      return (
        <Badge
          className={cn(
            " rounded-sm",
            disabled
              ? "bg-red-500 text-white"
              : enabled
              ? "bg-[#A1FFEE] text-[#127462]"
              : expired
              ? "bg-slate-200 text-slate-600"
              : ""
          )}
          variant={
            disabled
              ? "destructive"
              : enabled
              ? "success"
              : expired
              ? "secondary"
              : ""
          }
        >
          {disabled
            ? "Disabled"
            : enabled
            ? "Enabled"
            : expired
            ? "Expired"
            : ""}
        </Badge>
      );
    },
  },


  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Start Date")}
          accessorKey={"date_start"}
        />
      );
    },
    accessorKey: "date_start",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("End Date")}
          accessorKey={"date_end"}
        />
      );
    },
    accessorKey: "date_end",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Created")}
          accessorKey={"date_added"}
        />
      );
    },
    accessorKey: "date_added",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
];
