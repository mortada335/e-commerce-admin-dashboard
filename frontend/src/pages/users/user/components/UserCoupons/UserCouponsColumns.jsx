import Text from "@/components/layout/text";
import ActionsCell from "./ActionsCell";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  formatFullDate,
  formatFullDateNoTime,
  formatNumberWithCurrency,
} from "@/utils/methods";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
          <div className="text-left uppercase">{i18n.t("name")}</div>
      );
    },
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("code")}</div>,
    accessorKey: "code",
  },
  {
        header: () => <div className="text-left uppercase">{i18n.t("discount")}</div>,
    accessorKey: "discount",
    cell: ({ row }) => {
      // Convert the discount into four digits, to handle large amount of percentage.
      const fourDigitsDiscount = Number(row?.original?.discount).toFixed(4);

      return (
        <Text
          text={
            row?.original?.type === "P" || row?.original?.type === "X"
              ? `${fourDigitsDiscount} %`
              : formatNumberWithCurrency(
                  String(fourDigitsDiscount),
                  "IQD",
                  4,
                  4
                )
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
        header: () => <div className="text-left uppercase">{i18n.t("status")}</div>,
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
            ? i18n.t("Disabled")
            : enabled
            ? i18n.t("Enabled")
            : expired
            ? i18n.t("Expired")
            : ""}
        </Badge>
      );
    },
  },

  {
    header: ({ column }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-left uppercase">
          {i18n.t("Minimum")}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-left uppercase">{i18n.t("Minimum Total Cost")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    accessorKey: "total_min",
    cell: ({ row }) => (
      <Text
        text={formatNumberWithCurrency(
          String(row?.original?.total_min || 0),
          "IQD"
        )}
      />
    ),
  },

  {
    header: ({ column }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-left uppercase">
           {i18n.t("Maximum")}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-left uppercase">{i18n.t("Maximum Total Cost")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    accessorKey: "total_max",
    cell: ({ row }) => (
      <Text
        text={formatNumberWithCurrency(
          String(row?.original?.total_max || 0),
          "IQD"
        )}
      />
    ),
  },
  {
    header: ({ column }) => {
      return (
        <div className="text-left uppercase">{i18n.t("Start Date")}</div>
      );
    },
    accessorKey: "date_start",
    cell: ({ row }) => (
      <Text
        text={formatFullDate(row?.original?.date_start)}
       
      />
    ),
  },
  {
    header: ({ column }) => {
      return (
          <div className="text-left uppercase">{i18n.t("End Date")}</div>
      );
    },
    accessorKey: "date_end",
    cell: ({ row }) => (
      <Text
        text={formatFullDate(row?.original?.date_end)}
        
      />
    ),
  },
  {
    header: ({ column }) => {
      return (
         <div className="text-left uppercase">{i18n.t("Created")}</div>
      );
    },
    accessorKey: "date_added",
    cell: ({ row }) => (
      <Text
        text={formatFullDate(row?.original?.date_added)}
        
      />
    ),
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
];
