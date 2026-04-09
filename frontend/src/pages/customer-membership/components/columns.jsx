import i18n from "@/locales/i18n"
import DataTableColumnHeader from "./data-table-column-header"

export default [
  {
    header: () => <div className="text-left uppercase">{i18n.t("Customer Id")}</div>,
    accessorKey: "customerId",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("Customer Name")}</div>,
    accessorKey: "customer_name",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Highest Combined Points")}
          accessorKey={"highest_combined_points"}
        />
      )
    },
    accessorKey: "highestCombinedPoints",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Points Transferred Count")}
          accessorKey={"number_times_points_transferred"}
        />
      )
    },
    accessorKey: "numberTimesPointsTransferred",
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Reward Points")}
          accessorKey={"current_reward_points"}
        />
      )
    },

    accessorKey: "currentRewardPoints",
  },

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Membership")}
          accessorKey={"current_membership"}
        />
      )
    },
    accessorKey: "currentMembership",
  },

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Created")}
          accessorKey={"date_added"}
        />
      )
    },
    accessorKey: "dateAdded",
  },
  // {
  //   header: () => (
  //     <div className="text-left uppercase text-sm">Modified At</div>
  //   ),
  //   accessorKey: "pointsDateModified",
  // },
]
