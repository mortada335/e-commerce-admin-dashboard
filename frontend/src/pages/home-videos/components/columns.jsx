
import i18n from "@/locales/i18n"
import ActionsCell from "./ActionsCell"
import DataTableColumnHeader from "./data-table-column-header"
import Text from "@/components/layout/text"

import { formatDate, } from "@/utils/methods"

export default [
  {
    header: () => <div className="text-left capitalize">{i18n.t("#id")}</div>,
    accessorKey: "id",
  },

  {
    header: () => <div className="text-left uppercase">{i18n.t("video")}</div>,
    accessorKey: "video",
    cell: ({ row }) => {
      const item = row.original


      return (
        <div className="flex flex-col h-fit min-w-[200px] w-[200px] max-w-fit items-center gap-4">
                <video src={item.video} controls className="w-full rounded-md" />
                
              </div>
      )
    },
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Title")}
          accessorKey={"title"}
        />
      )
    },
    accessorKey: "title",
  },
  

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Banner Type")}
          accessorKey={"banner_type"}
        />
      )
    },
    accessorKey: "banner_type",
  },

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("target")}
          accessorKey={"banner_id"}
        />
      )
    },
    accessorKey: "banner_id",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Start Date")}
        accessorKey={"start_date"}
      />
    ),
    accessorKey: "start_date",
    cell: ({ row }) => <Text text={formatDate(row?.original?.start_date)} />,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("End Date")}
        accessorKey={"end_date"}
      />
    ),
    accessorKey: "end_date",
    cell: ({ row }) => <Text text={formatDate(row?.original?.end_date)} />,
  },
 
  {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
]
