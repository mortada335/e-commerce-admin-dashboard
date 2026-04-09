import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Text from "@/components/layout/text";
import {
  convertProductStatusIdToString,
  formatNumberWithCurrency,
} from "@/utils/methods";


// import { Label } from "@/components/ui/label"

import DataTableColumnHeader from "./data-table-column-header";
import ActionsCell from "./ActionsCell";
import i18n from "@/locales/i18n";

export default [
  {
    header: () => <div className="text-start uppercase">{i18n.t("Customer Id")}</div>,
    accessorKey: "customer_id",
    
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Quantity")}
          accessorKey={"quantity"}
        />
      );
    },
    
    accessorKey: "quantity",
    
  },
  {
    header: () => <div className="text-start uppercase">{i18n.t("option")}</div>,
    accessorKey: "option",
    
  },
  {
    header: () => <div className="text-start uppercase">{i18n.t("product_id")}</div>,
    accessorKey: "product_id",
    
  },

  {
    header: () => <div className="text-start uppercase">{i18n.t("Image")}</div>,
    accessorKey: "image",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <Avatar>
          <AvatarImage src={item?.image} alt={item?.model} />
          <AvatarFallback className="text-xs">{item?.model}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Model")}
          accessorKey={"model"}
        />
      );
    },
    accessorKey: "model",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Quantity Avilable")}
        accessorKey={"quantity_avilable"}
      />
    ),
    accessorKey: "quantity_avilable",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Price")}
          accessorKey={"price"}
        />
      );
    },
    accessorKey: "price",
    cell: ({ row }) => (
      <Text
        text={formatNumberWithCurrency(String(row?.original?.price), "IQD")}
      />
    ),
  },

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Status")}
          accessorKey={"enabled"}
        />
      );
    },
    accessorKey: "status",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <Badge
          className={cn(
            " rounded-sm",
            item.status
              ? "bg-[#A1FFEE] text-[#127462]"
              : "bg-red-500 text-white "
          )}
          variant={item.status ? "success" : "destructive"}
        >
          {item.status ? i18n.t("Enabled") : i18n.t("Disable")}
        </Badge>
      );
    },
  },

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Label")}
          accessorKey={"status"}
        />
      );
    },
    accessorKey: "label",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <Badge
          className={cn(
            " rounded-sm bg-blue-500 text-white w-[100px] justify-center"
          )}
        >
          {i18n.t(convertProductStatusIdToString(item.label))}
        </Badge>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("New")}
          accessorKey={"new_product"}
        />
      );
    },
    accessorKey: "new_product",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <Badge
          className={cn(
            " rounded-sm",
            item?.new_product
              ? "bg-blue-500 text-white"
              : "bg-red-500 text-white "
          )}
          variant={item?.new_product ? "success" : "destructive"}
        >
          {item?.new_product ? i18n.t("Yes") : i18n.t("No")}
        </Badge>
      );
    },
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
