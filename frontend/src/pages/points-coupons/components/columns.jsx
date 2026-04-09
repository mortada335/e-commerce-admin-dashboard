import i18n from "@/locales/i18n"
import ActionsCell from "./ActionsCell"
import DataTableColumnHeader from "./data-table-column-header"

export default [
  {
    header: () => <div className="text-left capitalize">#id</div>,
    accessorKey: "id",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("name")}
          accessorKey={"name"}
        />
      )
    },
    accessorKey: "name",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Points Needed")}
          accessorKey={"points_needed"}
        />
      )
    },
    accessorKey: "points_needed",
  },

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("discount")}
          accessorKey={"discount"}
        />
      )
    },
    accessorKey: "discount",
  },

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Created")}
          accessorKey={"created_at"}
        />
      )
    },
    accessorKey: "created_at",
  },
  // {
  //   header: ({ column }) => {
  //     return (
  //       <DataTableColumnHeader
  //         column={column}
  //         title={i18n.t("Days to expire")}
  //         accessorKey={"days_to_expire"}
  //       />
  //     )
  //   },
  //   accessorKey: "days_to_expire",
  // },
  // {
  //   header: () => <div className="text-left capitalize">{i18n.t("End Date")}</div>,
  //   accessorKey: "end_date",
  // },

  {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
]
