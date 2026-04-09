import { Badge } from "@/components/ui/badge";
import ActionsCell from "./ActionsCell";
import DataTableColumnHeader from "./data-table-column-header";
import { cn } from "@/lib/utils";
import i18n from "@/locales/i18n";

export default [
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="#ID" accessorKey="id" />
    ),
    accessorKey: "id",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Zone Name")}
        accessorKey="name"
      />
    ),
    accessorKey: "name",
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Distance")}
        accessorKey="distance"
      />
    ),
    accessorKey: "distance",
    cell: ({ row }) => `${row.original.distance ?? 0} km`,
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Threshold")}
        accessorKey="threshold"
      />
    ),
    accessorKey: "threshold",
    cell: ({ row }) => row.original.threshold ?? "-",
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Fees Above Threshold")}
        accessorKey="fees_above_threshold"
      />
    ),
    accessorKey: "fees_above_threshold",
    cell: ({ row }) => row.original.fees_above_threshold ?? "-",
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Fees Below Threshold")}
        accessorKey="fees_below_threshold"
      />
    ),
    accessorKey: "fees_below_threshold",
    cell: ({ row }) => row.original.fees_below_threshold ?? "-",
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Service Fee")}
        accessorKey="service_fee"
      />
    ),
    accessorKey: "service_fee",
    cell: ({ row }) => row.original.service_fee ?? "-",
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("MOV")} accessorKey="mov" />
    ),
    accessorKey: "mov",
    cell: ({ row }) => row.original.mov ?? "-",
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Status")}
        accessorKey="active"
      />
    ),
    accessorKey: "active",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Badge
          className={cn(
            "rounded-sm",
            item.active ? "bg-[#A1FFEE] text-[#127462]" : "bg-red-500 text-white"
          )}
          variant={item.active ? "success" : "destructive"}
        >
          {item.active ? i18n.t("Active") : i18n.t("Inactive")}
        </Badge>
      );
    },
  },

  {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",
    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
];
