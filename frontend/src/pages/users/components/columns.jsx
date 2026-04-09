import { Badge } from "@/components/ui/badge";
import ActionsCell from "./ActionsCell";

import DataTableColumnHeader from "./data-table-column-header";
import { cn } from "@/lib/utils";
import i18n from "@/locales/i18n";

export default [
  {
    // header: () => <div className="text-left capitalize"># id</div>, *This is the old version.

    // Modified to meet other columns header structure. - Muammar.jsx
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="#ID" accessorKey="id" />
    ),
    accessorKey: "id",
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("fullName")}
        accessorKey={"first_name"}
      />
    ),
    accessorKey: "name",
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Phone Number")}
        accessorKey={"username"}
      />
    ),
    accessorKey: "username",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("LTV")}
        accessorKey={"ltv"}
      />
    ),

    accessorKey: "ltv",
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Status")}
        accessorKey={"is_active"}
      />
    ),

    accessorKey: "is_active",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <Badge
          className={cn(
            " rounded-sm",
            item.is_active
              ? "bg-[#A1FFEE] text-[#127462]"
              : "bg-red-500 text-white "
          )}
          variant={item.is_active ? "success" : "destructive"}
        >
          {item.is_active ? i18n.t("Active") : i18n.t("Inactive")}
          {item.is_active}
        </Badge>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Joined Date")}
          accessorKey={"date_joined"}
        />
      );
    },

    accessorKey: "dateJoined",
  },

  {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
];
