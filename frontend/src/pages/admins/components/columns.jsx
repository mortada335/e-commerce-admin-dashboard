import { Badge } from "@/components/ui/badge";
import ActionsCell from "./ActionsCell";

import DataTableColumnHeader from "./data-table-column-header";
import { cn } from "@/lib/utils";
import i18n from "@/locales/i18n";

export default [
  {
    header: () => <div className="text-left capitalize">{i18n.t("#id")}</div>,
    accessorKey: "id",
  },

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Username")}
          accessorKey={"username"}
        />
      );
    },

    accessorKey: "username",
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Roles")}
        accessorKey="roles"
      />
    ),
    accessorKey: "roles",
    cell: ({ row }) => {

      const roles = row.original?.roles || [];
      return (
        <div className="flex flex-wrap gap-1">
          {roles.length > 0 ? (
            roles.map((role) => (
              <Badge
                variant="outline"
                key={role.id}
                className="rounded-md truncate"
              >
                {/* {console.log("role", role)} */}

                {role.name}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">{i18n.t("No roles")}</span>
          )}
        </div>
      );
    },
  },

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Status")}
          accessorKey={"is_active"}
        />
      );
    },

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
    header: () => (
      <div className="text-left uppercase">{i18n.t("Actions")}</div>
    ),
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
];
