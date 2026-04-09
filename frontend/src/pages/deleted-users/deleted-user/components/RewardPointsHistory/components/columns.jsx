import { formatNumberWithCurrency } from "@/utils/methods";
import DataTableColumnHeader from "./data-table-column-header";
import Text from "@/components/layout/text";
import { Link } from "react-router-dom";

export default [
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Order ID"}
          accessorKey={"order_id"}
        />
      );
    },
    accessorKey: "order_id",

    cell: ({ row }) => {
      const orderId = row?.original?.order_id;

      return (
        <Link
          to={`/sales/orders/details/${orderId}`}
          className="font-medium hover:text-blue-500 transition"
        >
          {orderId}
        </Link>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Previous Points"}
          accessorKey={"previous_points"}
        />
      );
    },
    accessorKey: "previous_points",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Order Total"}
          accessorKey={"order_total"}
        />
      );
    },

    accessorKey: "order_total",

    cell: ({ row }) => {
      const item = row?.original;

      return (
        <Text
          className="flex-1 text-slate-800 dark:text-white"
          text={formatNumberWithCurrency(String(item?.order_total), "IQD")}
        />
      );
    },
  },

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"New Points"}
          accessorKey={"new_points"}
        />
      );
    },
    accessorKey: "new_points",
  },

  // Action
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Action"}
          accessorKey={"action"}
        />
      );
    },
    accessorKey: "action",

    cell: ({ row }) => {
      const action = row?.original?.action;

      return <Text text={action} className="capitalize sm" />;
    },
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Date Added"}
          accessorKey={"date_added"}
        />
      );
    },
    accessorKey: "date_added",
  },
  // {
  //   header: () => (
  //     <div className="text-left uppercase text-sm">Modified At</div>
  //   ),
  //   accessorKey: "pointsDateModified",
  // },
];
