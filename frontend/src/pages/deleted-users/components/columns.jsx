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
        title={i18n.t("fullname")}
        accessorKey={"name"}
      />
    ),
    accessorKey: "name",
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Phone Number")}
        accessorKey={"phone_number"}
      />
    ),
    accessorKey: "phone_number",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Is Staff")}
        accessorKey={"is_staff"}
      />
    ),

    accessorKey: "is_staff",

    cell: ({ row }) => {
      const item = row.original;

      return (
        <Badge
          className={cn(
            " rounded-sm",
            item.is_staff
              ? "bg-[#A1FFEE] text-[#127462]"
              : "bg-red-500 text-white "
          )}
          variant={item.is_staff ? "success" : "destructive"}
        >
          {item.is_staff ? i18n.t("Yes") : i18n.t("No")}
          {item.is_staff}
        </Badge>
      );
    },
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
            item.status
              ? "bg-[#A1FFEE] text-[#127462]"
              : "bg-red-500 text-white "
          )}
          variant={item.status ? "success" : "destructive"}
        >
          {item.status ? i18n.t("Active") : i18n.t("Inactive")}
          {item.status}
        </Badge>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Deleted Date")}
          accessorKey={"date_deleted"}
        />
      );
    },

    accessorKey: "date_deleted",
  },

  {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
];
