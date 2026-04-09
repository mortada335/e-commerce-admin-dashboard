import DataTableColumnHeader from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
          title={"Points"}
          accessorKey={"points"}
        />
      );
    },
    accessorKey: "points",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Status"}
          accessorKey={"is_active"}
        />
      );
    },

    accessorKey: "is_active",

    cell: ({ row }) => {
      const isActive = row?.original?.is_active;

      return (
        <Badge
          className={cn(
            " rounded-sm",
            isActive
              ? "bg-red-500 text-white hover:bg-red-400"
              : "bg-[#A1FFEE] text-[#127462] hover:bg-emerald-200"
          )}
          variant={!isActive ? "destructive" : "success"}
        >
          {isActive ? "Not Added Yet" : "Added"}
        </Badge>
      );
    },
  },

  // Extras
  // {
  //   header: ({ column }) => {
  //     return (
  //       <DataTableColumnHeader
  //         column={column}
  //         title="Extras"
  //         accessorKey="extras"
  //       />
  //     );
  //   },
  //   accessorKey: "extras",
  // },

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

    cell: ({ row }) => {
      const dateAdded = row?.original?.date_added;
      return <p>{dateAdded}</p>;
    },
  },
  // {
  //   header: () => (
  //     <div className="text-left uppercase text-sm">Modified At</div>
  //   ),
  //   accessorKey: "pointsDateModified",
  // },
];
