
import Text from "@/components/layout/text";
import {

  displayBasicDate,

} from "@/utils/methods";


import DataTableColumnHeader from "./data-table-column-header";

// import { toast } from "@/components/ui/use-toast";

export default [

  {
    header: ({ column }) => (

            <DataTableColumnHeader
              column={column}
              title={"Product"}
              accessorKey={"product_id"}
            />

    ),

    accessorKey: "product_id",
    cell: ({ row }) => <Text text={row?.original?.product_id} />,
  },
  {
    header: ({ column }) => (
   
            <DataTableColumnHeader
              column={column}
              title={"Old Info"}
              accessorKey={"old_info"}
            />

    ),

    accessorKey: "old_info",
    cell: ({ row }) => <Text text={row?.original?.old_info} />,
  },
  {
    header: ({ column }) => (
   
            <DataTableColumnHeader
              column={column}
              title={"New Info"}
              accessorKey={"new_info"}
            />

    ),

    accessorKey: "new_info",
    cell: ({ row }) => <Text text={row?.original?.new_info} />,
  },
  {
    header: ({ column }) => (
   
            <DataTableColumnHeader
              column={column}
              title={"Modify by"}
              accessorKey={"modifyby"}
            />

    ),

    accessorKey: "modifyby",
    cell: ({ row }) => <Text text={row?.original?.modifyby} />,
  },
  {
    header: ({ column }) => (
   
            <DataTableColumnHeader
              column={column}
              title={"Note Admin"}
              accessorKey={"noteAdmin"}
            />

    ),

    accessorKey: "noteAdmin",
    cell: ({ row }) => <Text text={row?.original?.noteAdmin} />,
  },

  {
    header: ({ column }) => (
   
            <DataTableColumnHeader
              column={column}
              title={"Date Edit"}
              accessorKey={"date_edit"}
            />

    ),

    accessorKey: "date_edit",
    cell: ({ row }) => <Text text={row?.original?.date_edit} />,
  },
  {
    header: ({ column }) => (
   
            <DataTableColumnHeader
              column={column}
              title={"Date Added"}
              accessorKey={"date_added"}
            />

    ),

    accessorKey: "date_added",
    cell: ({ row }) => <Text text={row?.original?.date_added?displayBasicDate( row?.original?.date_added):''} />,
  },
  {
    header: ({ column }) => (
   
            <DataTableColumnHeader
              column={column}
              title={"Date Modified"}
              accessorKey={"date_modified"}
            />

    ),

    accessorKey: "date_modified",
    cell: ({ row }) => <Text text={row?.original?.date_modified?displayBasicDate( row?.original?.date_modified):''} />,
  },







];
