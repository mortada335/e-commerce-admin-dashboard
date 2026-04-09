

import ActionsCell from "./ActionsCell";



import { clearSortValue, setSortBy, setSortType, useGiftCardsStore } from "../store";


import { customFormatDate, displayBasicDate, formatNumberWithCurrency } from "@/utils/methods";
import CustomDataTableColumnHeader from "@/components/data-table/custom-data-table-column-header";
import i18n from "@/locales/i18n";


export default [

  {
    header: ({ column }) => {
      return (
        <CustomDataTableColumnHeader
          useStore={useGiftCardsStore}
                    setSortType={setSortType}
          setSortBy={setSortBy}
          clearSortValue={clearSortValue}
          column={column}
          title={i18n.t("Code")}
          accessorKey={"code"}
        />
      );
    },
    accessorKey: "code",
  },
  {
    header: ({ column }) => {
      return (
        <CustomDataTableColumnHeader
          useStore={useGiftCardsStore}
                    setSortType={setSortType}
          setSortBy={setSortBy}
          clearSortValue={clearSortValue}
          column={column}
          title={i18n.t("Amount IQD")}
          accessorKey={"amount_iqd"}
        />
      );
    },
    accessorKey: "amount_iqd",
      cell: ({ row }) => <p>{formatNumberWithCurrency(row.original?.amount_iqd,'IQD')}</p>,
  },



  {
    header: ({ column }) => {
      return (
        <CustomDataTableColumnHeader
          useStore={useGiftCardsStore}
                    setSortType={setSortType}
          setSortBy={setSortBy}
          clearSortValue={clearSortValue}
          column={column}
          title={i18n.t("redeemed date")}
          accessorKey={"redeemed_at"}
        />
      );
    },
    accessorKey: "redeemed_at",
    cell: ({ row }) => <p>{customFormatDate(row.original?.redeemed_at,true)}</p>,
  },
  {
    header: ({ column }) => {
      return (
        <CustomDataTableColumnHeader
          useStore={useGiftCardsStore}
          setSortType={setSortType}
          setSortBy={setSortBy}
          clearSortValue={clearSortValue}
          column={column}
          title={i18n.t("created date")}
          accessorKey={"created_at"}
        />
      );
    },
    accessorKey: "created_at",
    cell: ({ row }) => <p>{customFormatDate(row.original?.created_at,true)}</p>,
  },
  // {
  //   header: ({ column }) => {
  //     return (
  //       <CustomDataTableColumnHeader
  //         useStore={useGiftCardsStore}
  //         setSortType={setSortType}
  //         setSortBy={setSortBy}
  //         clearSortValue={clearSortValue}
  //         column={column}
  //         title={"updated date"}
  //         accessorKey={"updated_at"}
  //       />
  //     );
  //   },
  //   accessorKey: "updated_at",
  //   cell: ({ row }) => <p>{customFormatDate(row.original?.updated_at,true)}</p>,
  // },
  {
     header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
];
