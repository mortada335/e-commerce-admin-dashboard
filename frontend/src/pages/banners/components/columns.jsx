import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ActionsCell from "./ActionsCell"
import DataTableColumnHeader from "./data-table-column-header"
import Text from "@/components/layout/text"
import SortOrderInput from "@/components/SortOrderInput"
import { BANNER_URL } from "@/utils/constants/urls"
import { formatFullDate } from "@/utils/methods"
import i18n from "@/locales/i18n"

export default [
  {
    header: () => <div className="text-left capitalize">{i18n.t("#id")}</div>,
    accessorKey: "banner_image_id",
  },

  {
    header: () => <div className="text-left uppercase">{i18n.t("Image")}</div>,
    accessorKey: "image",
    cell: ({ row }) => {
      const item = row.original


      return (
        <Avatar>
        <AvatarImage src={item?.image} alt={item.title} />
        <AvatarFallback>{item.banner_image_id}</AvatarFallback>
      </Avatar>
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
          title={i18n.t("Language")}
          accessorKey={"language_id"}
        />
      )
    },
    accessorKey: "language_id",
    cell: ({ row }) =><p>{row?.original?.language_id===1?'english':'arabic'}</p>,
    
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Index")}
          accessorKey={"sort_order"}
        />
      )
    },
    accessorKey: "sort_order",
    cell: ({ row }) => <SortOrderInput url={BANNER_URL}  banner={row?.original} />,
    
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
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Event Start Date")}
        accessorKey={"event_date"}
      />
    ),
    accessorKey: "event_date",
    cell: ({ row }) => <Text text={formatFullDate(row?.original?.event_date)} />,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Event End Date")}
        accessorKey={"event_date_end"}
      />
    ),
    accessorKey: "event_date_end",
    cell: ({ row }) => <Text text={formatFullDate(row?.original?.event_date_end)} />,
  },
 
  {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
]
