import { Badge } from "@/components/ui/badge";
import ActionsCell from "./ActionsCell";
import { cn } from "@/lib/utils";
import Text from "@/components/layout/text";
import {
  convertStatusIdToString,
  formatNumberWithCurrency,
} from "@/utils/methods";
import {
  BadgeAlert,
  BadgeCheck,
  BadgeMinus,
  BadgePlus,
  // CreditCard,
  // HandCoins,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DataTableColumnHeader from "./data-table-column-header";
// import { toast } from "@/components/ui/use-toast";

export default [
  {
    // header: () => <div className="text-left uppercase w-fit">order</div>, *This is the old version of it.

    // Modified to meet the other columns structure. - Muammar.jsx
    header: ({ column }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-left uppercase">
            <DataTableColumnHeader
              column={column}
              title={"order"}
              accessorKey={"orderId"}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-left uppercase">order</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    accessorKey: "orderId",
    cell: ({ row }) => <Text text={row?.original?.orderId} />,
  },

  {
    header: ({ column }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-left uppercase">
            <DataTableColumnHeader
              column={column}
              title={"Customer"}
              accessorKey={"customer_name"}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-left uppercase">Customer name</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),

    accessorKey: "customer",
    cell: ({ row }) => <Text text={row?.original?.customer} />,
  },

  {
    header: () => <div className="text-left uppercase">customer No</div>,

    accessorKey: "customerNumber",
    cell: ({ row }) => <Text text={row?.original?.customerNumber} />,
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Model"}
        accessorKey={"model"}
      />
    ),

    accessorKey: "model",
    cell: ({ row }) => <Text text={row?.original?.model} />,
  },
  {
    header: () => <div className="text-left uppercase">status</div>,

    accessorKey: "status",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="w-full flex justify-start items-center gap-2">
              <Badge
                className={cn(
                  " rounded-sm  text-white uppercase !text-xs ",
                  Number(item.status) === 5
                    ? "bg-green-500 hover:bg-green-400"
                    : Number(item.status) === 7 || Number(item.status) === 20
                    ? "bg-yellow-500 hover:bg-yellow-400"
                    : Number(item.status) === 11 || Number(item.status) === 21
                    ? "bg-red-500 hover:bg-red-400"
                    : "bg-blue-500 hover:bg-blue-400"
                )}
              >
                {Number(item.status) === 5 ? (
                  <BadgeCheck size={16} />
                ) : Number(item.status) === 7 || Number(item.status) === 20 ? (
                  <BadgeAlert size={16} />
                ) : Number(item.status) === 11 || Number(item.status) === 21 ? (
                  <BadgeMinus size={16} />
                ) : (
                  <BadgePlus size={16} />
                )}
              </Badge>
              <span>{convertStatusIdToString(item.status)}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className=" text-xs">{convertStatusIdToString(item.status)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Price"}
          accessorKey={"price"}
        />
      );
    },
    accessorKey: "price",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Text
          className="flex-1"
          text={formatNumberWithCurrency(String(row?.original?.price), "IQD")}
        />
      </div>
    ),
  },

  // TOTAL.
  // {
  //   header: ({ column }) => {
  //     return (
  //       <DataTableColumnHeader
  //         column={column}
  //         title={"total"}
  //         accessorKey={"total"}
  //       />
  //     );
  //   },
  //   accessorKey: "total",
  //   cell: ({ row }) => (
  //     <div className="flex justify-center">
  //       <Text
  //         className="flex-1"
  //         text={formatNumberWithCurrency(String(row?.original?.total), "IQD")}
  //       />
  //     </div>
  //   ),
  // },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Quantity"}
        accessorKey={"quantity"}
      />
    ),

    accessorKey: "quantity",
    cell: ({ row }) => <Text text={row?.original?.quantity} />,
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Created"}
        accessorKey={"date_added"}
      />
    ),
    accessorKey: "dateAdded",
    cell: ({ row }) => <Text text={row?.original?.dateAdded} />,
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Modified"}
        accessorKey={"date_modified"}
      />
    ),
    accessorKey: "dateModified",
    cell: ({ row }) => <Text text={row?.original?.dateModified} />,
  },

  {
    header: () => <div className="text-left uppercase">Actions</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
];
