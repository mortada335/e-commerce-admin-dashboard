/* eslint-disable react/prop-types */
// ProductsList page components

import i18n from "@/locales/i18n";

// Images

export default [
  {
    header: () => <div className="text-left capitalize">{i18n.t("#id")}</div>,
    accessorKey: "id",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("title")}</div>,
    accessorKey: "title",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("body")}</div>,

    accessorKey: "body",
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("sent at")}</div>,

    accessorKey: "sentAt",
  },
]
