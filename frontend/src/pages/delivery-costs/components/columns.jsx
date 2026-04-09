import i18n from "@/locales/i18n";
import ActionsCell from "./ActionsCell";

export default [
  // {
  //   header: () => <div className="text-start capitalize">#id</div>,
  //   accessorKey: "id",
  //   cell: ({ row }) => {
  //     const item = row.original 

  //     return <p># {item.id}</p>
  //   },
  // },

  {
    header: () => <div className="text-start uppercase">{i18n.t("Zone")}</div>,
    accessorKey: "zone",
  },
  {
    header: () => <div className="text-start uppercase">{i18n.t("Cost")}</div>,
    accessorKey: "cost",
  },
  {
    header: () => <div className="text-start uppercase">{i18n.t("Special Cost")}</div>,
    accessorKey: "special_cost",
  },
  {
    header: () => (
      <div className="text-start uppercase">{i18n.t("Minimum Total Cost")}</div>
    ),
    accessorKey: "special_cost_total_order",
  },
  {
    header: () => <div className="text-start uppercase">{i18n.t("Start Date")}</div>,
    accessorKey: "start_date",
  },
  {
    header: () => <div className="text-start uppercase">{i18n.t("End Date")}</div>,
    accessorKey: "end_date",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
]
