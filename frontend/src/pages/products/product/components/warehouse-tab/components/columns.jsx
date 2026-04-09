import Text from "@/components/layout/text";
import { displayBasicDate } from "@/utils/methods";

import DataTableColumnHeader from "./data-table-column-header";

// import { toast } from "@/components/ui/use-toast";

export default [
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"warehouse"}
        accessorKey={"warehouse_id"}
      />
    ),

    accessorKey: "warehouse_id",
    cell: ({ row }) => <Text text={row?.original?.warehouse_id} />,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Warehouse name"}
        accessorKey={"warehouse_name"}
      />
    ),

    accessorKey: "warehouse_name",
    cell: ({ row }) => <Text text={row?.original?.warehouse_name} />,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"available quantity"}
        accessorKey={"available_quantity"}
      />
    ),

    accessorKey: "available_quantity",
    cell: ({ row }) => <Text text={row?.original?.available_quantity} />,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"reserved"}
        accessorKey={"reserved"}
      />
    ),
    accessorKey: "reserved",
    cell: ({ row }) => <Text text={row?.original?.reserved} />,
  },
];
