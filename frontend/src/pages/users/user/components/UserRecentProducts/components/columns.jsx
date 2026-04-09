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

export default [
  {
    header: () => <div className="text-start capitalize">#</div>,
    accessorKey: "id",
    
  },

  {
    header: () => <div className="text-start uppercase">Product</div>,
    accessorKey: "product",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <Avatar>
          <AvatarImage src={item?.product} alt={item?.model} />
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
          title={"Model"}
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
        title={"Quantity"}
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
          title={"Price"}
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
          title={"Status"}
          accessorKey={"enabled"}
        />
      );
    },
    accessorKey: "enabled",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <Badge
          className={cn(
            " rounded-sm",
            item.enabled
              ? "bg-[#A1FFEE] text-[#127462]"
              : "bg-red-500 text-white "
          )}
          variant={item.enabled ? "success" : "destructive"}
        >
          {item.enabled ? "Enabled" : "Disable"}
        </Badge>
      );
    },
  },

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Label"}
          accessorKey={"status"}
        />
      );
    },
    accessorKey: "status",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <Badge
          className={cn(
            " rounded-sm bg-blue-500 text-white w-[100px] justify-center"
          )}
        >
          {convertProductStatusIdToString(item.status)}
        </Badge>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"New"}
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
          {item?.new_product ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"viewed"}
          accessorKey={"viewed_at"}
        />
      );
    },

    accessorKey: "viewed_at",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Created"}
          accessorKey={"date_added"}
        />
      );
    },

    accessorKey: "date_added",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Modified"}
          accessorKey={"date_modified"}
        />
      );
    },
    accessorKey: "date_modified",
  },

];
