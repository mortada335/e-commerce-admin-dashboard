
import i18n from "@/locales/i18n"
import ActionsCell from "./ActionsCell"
import DataTableColumnHeader from "./data-table-column-header"
import Text from "@/components/layout/text"


export default [

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Level")}
          accessorKey={"level"}
        />
      )
    },
    accessorKey: "level",
  },
  
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("message")}
          accessorKey={"message"}
        />
      )
    },
    accessorKey: "message",
    cell: ({ row }) =><p>{row?.original?.message}</p>,
    
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Created Date")}
        accessorKey={"created_at"}
      />
    ),
    accessorKey: "created_at",
    cell: ({ row }) => <Text text={row?.original?.created_at} />,
  },

 
  // {
  //   header: () => <div className="text-left uppercase">Actions</div>,
  //   accessorKey: "actions",

  //   cell: ({ row }) => <ActionsCell item={row.original} />,
  // },
]
