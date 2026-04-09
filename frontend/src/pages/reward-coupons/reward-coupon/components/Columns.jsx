import { formatFullDate } from "@/utils/methods";
import DataTableColumnHeader from "../../components/data-table-column-header";
import Text from "@/components/layout/text";
import i18n from "@/locales/i18n";

const TEXT_STYLE = "text-left uppercase";

export default [
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Customer Id")}
        accessorKey="customer_id"
        className={TEXT_STYLE}
      />
    ),

    accessorKey: "customer_id",

    cell: ({ row }) => {
      return <Text text={row?.original?.customer_id} />;
    },
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Coupon Id")}
        accessorKey="coupon_id"
        className={TEXT_STYLE}
      />
    ),

    accessorKey: "coupon_id",

    cell: ({ row }) => <Text text={row?.original?.coupon_id} />,
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Customer Username")}
        accessorKey="customer_username"
        className={TEXT_STYLE}
      />
    ),

    accessorKey: "customer_username",

    cell: ({ row }) => <Text text={row?.original?.customer_info?.username} />,
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Customer Firstname")}
        accessorKey="customer_firstname"
        className={TEXT_STYLE}
      />
    ),

    accessorKey: "customer_firstname",

    cell: ({ row }) => <Text text={row?.original?.customer_info?.first_name} />,
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Coupoun History Id")}
        accessorKey="coupon_history_id"
        className={`${TEXT_STYLE} min-w-32`}
      />
    ),

    accessorKey: "coupon_history_id",

    cell: ({ row }) => <Text text={row?.original?.coupon_history_id} />,
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Amount")}
        accessorKey="amount"
        className={TEXT_STYLE}
      />
    ),

    accessorKey: "amount",

    cell: ({ row }) => <Text text={row?.original?.amount} />,
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Order Id")}
        accessorKey="order_id"
        className={TEXT_STYLE}
      />
    ),

    accessorKey: "order_id",

    cell: ({ row }) => <Text text={row?.original?.order_id} />,
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Date Added")}
        accessorKey="date_added"
        className={TEXT_STYLE}
      />
    ),

    accessorKey: "date_added",

    cell: ({ row }) => (
      <Text text={formatFullDate(row?.original?.date_added)} />
    ),
  },
];
