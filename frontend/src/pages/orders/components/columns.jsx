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
import { toast } from "@/components/ui/use-toast";
import OrderPaymentMethod from "./OrderPaymentMethod";
import i18n from "@/locales/i18n";
import { getDurationBetween } from "@/utils/helpers";

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
              title={i18n.t("order")}
              accessorKey={"orderId"}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-left uppercase">{i18n.t("order")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    accessorKey: "orderId",
    cell: ({ row }) => <Text text={row?.original?.orderId} />,
  },

  // {
  //   header: ({ column }) => (
  //     <TooltipProvider>
  //       <Tooltip>
  //         <TooltipTrigger className="text-left uppercase">
  //           <DataTableColumnHeader
  //             column={column}
  //             title={"Customer"}
  //             accessorKey={"payment_firstname"}
  //           />
  //         </TooltipTrigger>
  //         <TooltipContent>
  //           <p className="text-left uppercase">Customer name</p>
  //         </TooltipContent>
  //       </Tooltip>
  //     </TooltipProvider>
  //   ),

  //   accessorKey: "customer",
  //   cell: ({ row }) => <Text text={row?.original?.customer} />,
  // },
  {
    header: ({ column }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-left uppercase">
            <DataTableColumnHeader
              column={column}
              title={i18n.t("shipment")}
              accessorKey={"shipping_firstname"}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-left uppercase">{i18n.t("shipment name")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),

    accessorKey: "shipmentName",
    cell: ({ row }) => <Text text={row?.original?.shipmentName} />,
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-[10rem]"
        columns={column}
        title={i18n.t("Customer Name")}
        accessorKey="customerName"
      />
    ),

    accessorKey: "customerName",
    cell: ({ row }) => <Text text={row?.original?.customerName} />,
  },

  {
    header: () => <div className="text-left uppercase">{i18n.t("customer No")}</div>,

    accessorKey: "customerNumber",
    cell: ({ row }) => <Text text={row?.original?.customerNumber} />,
  },
  // {
  //   header: () => <div className="text-left uppercase">{i18n.t("status")}</div>,

  //   accessorKey: "status",
  //   cell: ({ row }) => {
  //     const item = row.original;

  //     return (
  //       <TooltipProvider>
  //         <Tooltip>
  //           <TooltipTrigger className="w-full flex justify-start items-center gap-2">
  //             <Badge
  //               className={cn(
  //                 " rounded-sm  text-white uppercase !text-xs ",
  //                 Number(item.status) === 5
  //                   ? "bg-green-500 hover:bg-green-400"
  //                   : Number(item.status) === 7 || Number(item.status) === 20
  //                   ? "bg-yellow-500 hover:bg-yellow-400"
  //                   : Number(item.status) === 11 || Number(item.status) === 21
  //                   ? "bg-red-500 hover:bg-red-400"
  //                   : "bg-blue-500 hover:bg-blue-400"
  //               )}
  //             >
  //               {Number(item.status) === 5 || Number(item.status) === 25 ? (
  //                 <BadgeCheck size={16} />
  //               ) : Number(item.status) === 7 || Number(item.status) === 20 ? (
  //                 <BadgeAlert size={16} />
  //               ) : Number(item.status) === 11 || Number(item.status) === 21 ? (
  //                 <BadgeMinus size={16} />
  //               ) : (
  //                 <BadgePlus size={16} />
  //               )}
  //             </Badge>
  //             <span>{i18n.t(convertStatusIdToString(item.status))}</span>
  //           </TooltipTrigger>
  //           <TooltipContent>
  //             <p className=" text-xs">{i18n.t(convertStatusIdToString(item.status))}</p>
  //           </TooltipContent>
  //         </Tooltip>
  //       </TooltipProvider>
  //     );
  //   },
  // },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("order_status")}
          accessorKey={"order_status"}
        />
      );
    },
    accessorKey: "order_status_id",
    cell: ({ row }) => (
      <div className="flex justify-center">
 
          <Badge 
            variant="outline" 
            className="w-fit text-sm truncate"
          >
            {i18n.t(convertStatusIdToString(row?.original?.orderData?.order_status_id))}
          </Badge>
      </div>
    ),
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("total")}
          accessorKey={"total"}
        />
      );
    },
    accessorKey: "total",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Text
          className="flex-1"
          text={formatNumberWithCurrency(String(row?.original?.total), "IQD")}
        />
      </div>
    ),
  },
  {
    header: () => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-left uppercase">
            {i18n.t("Method")}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-left uppercase">{i18n.t("Payment Method")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),

    accessorKey: "paymentMethod",
    // cell: ({ row }) => <Text text={row?.original?.paymentMethod} />,
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div className="w-full flex justify-center items-center gap-1">
          {/* <Badge
                  className={cn(
                    " rounded-sm  text-white uppercase !text-xs",
                    item.paymentMethod === "PayTabs Express Checkout"?"bg-green-500 hover:bg-green-400":"bg-blue-500",
                
                  )}
                
                >
                {item.paymentMethod === "PayTabs Express Checkout" ? <CreditCard size={16} /> :<HandCoins size={16} />}
                </Badge> */}
            <OrderPaymentMethod method={i18n.t(item.paymentMethod)}/>
        </div>
      );
    },
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Created")}
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
        title={i18n.t("Modified")}
        accessorKey={"date_modified"}
      />
    ),
    accessorKey: "dateModified",
    cell: ({ row }) => <Text text={row?.original?.dateModified} />,
  },
  {
  header: ({ column }) => (
    <DataTableColumnHeader
      column={column}
      title={i18n.t("Assigned Users")}
      accessorKey={"assignees"}
    />
  ),
  accessorKey: "assignees",
  cell: ({ row }) => {
    const assignees = row?.original?.orderData?.assignees || [];
    
    if (assignees.length === 0) {
    return <p>{i18n.t("Unassigned")}</p>
    }

    return (
      <div className="flex flex-col gap-1">
        {assignees?.map((assignee) => (
          <Badge
            key={assignee.id} 
            variant="default" 
            className="w-fit text-sm truncate"
          >
            {assignee.name}
          </Badge>
        ))}
      </div>
    );
  },
},

  {
    // header: () => <div className="text-left uppercase">coupon</div>, *This is the old verison.

    // Modified to meet the columns header strucutre. - Muammar.jsx
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("coupon")}
        accessorKey="coupon"
      />
    ),
// convertStatusIdToString
    accessorKey: "coupon",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            onClick={() => {
              navigator.clipboard.writeText(row?.original?.coupon);
              toast({
                title: "Copied!",
                description: "Promo code copied to clipboard successfully.",
              });
            }}
            className="text-left"
          >
            <Text className="cursor-pointer text-red-500 h-full !font-bold " text={row?.original?.coupon} />
          </TooltipTrigger>
          <TooltipContent>
            <Text text={row?.original?.coupon} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
  header: ({ column }) => (
    <DataTableColumnHeader
      column={column}
      title={i18n.t("Preparing Duration")}
      accessorKey={"preparing_duration"}
    />
  ),
  accessorKey: "preparing_duration",
  cell: ({ row }) => {
    const start = row?.original?.orderData?.preparing_started_at;
    const end = row?.original?.orderData?.preparing_ended_at;

    const duration = getDurationBetween(start, end);

    return (
      <div className="flex justify-center items-center">
        {duration ? (
          <Badge variant="secondary" className="text-sm">
            {duration}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-gray-400 truncate text-xs">
            {i18n.t("Not Started")}
          </Badge>
        )}
      </div>
    );
  },
},


  {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
];
