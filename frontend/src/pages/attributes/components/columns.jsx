import i18n from "@/locales/i18n"
import ActionsCell from "./ActionsCell"
import DataTableColumnHeader from "./data-table-column-header"

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
          title={i18n.t("Arabic Name")}
          accessorKey={"attribute_id"}
        />
      )
    },
    accessorKey: "nameArabic",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("English Name")}
          accessorKey={"attribute_id"}
        />
      )
    },
    accessorKey: "nameEnglish",
  },

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Attribute Group")}
          accessorKey={"attribute_group_id"}
        />
      )
    },
    accessorKey: "attribute_group_name",
  },

  {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
]
