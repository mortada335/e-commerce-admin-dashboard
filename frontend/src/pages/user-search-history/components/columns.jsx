import i18n from "@/locales/i18n"
import DataTableColumnHeader from "./data-table-column-header"

export default [


  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Searched Date")}
          accessorKey={"last_searched"}
        />
      )
    },
    accessorKey: "last_searched",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Search Param")}
          accessorKey={"search_param"}
        />
      )
    },
    accessorKey: "search_param",
  },
  
  // {
  //   header: () => (
  //     <div className="text-left uppercase text-sm">Modified At</div>
  //   ),
  //   accessorKey: "pointsDateModified",
  // },
]
