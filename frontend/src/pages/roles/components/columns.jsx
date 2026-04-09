import { Badge } from "@/components/ui/badge";
import ActionsCell from "./ActionsCell";

import DataTableColumnHeader from "./data-table-column-header";
import { cn } from "@/lib/utils";
import i18n from "@/locales/i18n";

export default [
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("#id")} accessorKey="id" />
    ),
    accessorKey: "id",
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("name")}
        accessorKey={"name"}
      />
    ),
    accessorKey: "name",
  },
  // {
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title={i18n.t("Permissions Count")}
  //       accessorKey={"permissions"}
  //     />
  //   ),
  //   accessorKey: "permissions",
  //   cell: ({ row }) => (
  //     <Badge variant="secondary" className="min-w-[40px] justify-center">
  //       {row?.original?.permissions?.length || 0}
  //     </Badge>
  //   )
  // },

  {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",
    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
];