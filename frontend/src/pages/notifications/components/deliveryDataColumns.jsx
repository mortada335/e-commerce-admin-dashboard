/* eslint-disable react/prop-types */
// ProductsList page components

import i18n from "@/locales/i18n";

// Images

export default [
  {
    header: () => <div className="text-left uppercase">{i18n.t("#id")}</div>,
    accessorKey: "id",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("Event")}</div>,
    accessorKey: "event",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("Event Count")}</div>,

    accessorKey: "event_count",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("Date")}</div>,

    accessorKey: "date",
  },
]
