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
          title={i18n.t("Group Arabic Name")}
          accessorKey={"name"}
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
          title={i18n.t("Group English Name")}
          accessorKey={"name"}
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
          title={i18n.t("Attributes Count")}
          accessorKey={"num_of_attributes"}
        />
      )
    },
    accessorKey: "num_of_attributes",
  },

  {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
]
