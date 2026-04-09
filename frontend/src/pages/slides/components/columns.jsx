import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ActionsCell from "./ActionsCell"
import DataTableColumnHeader from "./data-table-column-header"
import i18n from "@/locales/i18n"

export default [
  {
    header: () => <div className="text-left capitalize">{i18n.t("#id")}</div>,
    accessorKey: "banner_image_id",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("Arabic Image")}</div>,
    accessorKey: "arabicImage",
    cell: ({ row }) => {
      const item = row.original

      return (
        <Avatar>
          <AvatarImage src={item.image} alt={item.title} />
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
          title={i18n.t("Arabic Title")}
          accessorKey={"titles"}
        />
      )
    },
    accessorKey: "arabicTitle",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("English Image")}</div>,
    accessorKey: "englishImage",
    cell: ({ row }) => {
      const item = row.original


      return (
        <Avatar>
        <AvatarImage src={item?.englishImage} alt={item.englishTitle} />
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
          title={i18n.t("English Title")}
          accessorKey={"englishTitle"}
        />
      )
    },
    accessorKey: "englishTitle",
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
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Slide type")}
          accessorKey={"banner_type"}
        />
      )
    },
    accessorKey: "banner_type",
  },
 
  {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
]
