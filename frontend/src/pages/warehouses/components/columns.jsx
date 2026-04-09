

import ActionsCell from "./ActionsCell";



import { clearSortValue, setSortBy, setSortType, useWarehousesStore } from "../store";


import { customFormatDate, displayBasicDate, formatNumberWithCurrency } from "@/utils/methods";
import CustomDataTableColumnHeader from "@/components/data-table/custom-data-table-column-header";
import i18n from "@/locales/i18n";


export default [

  {
    header: ({ column }) => {
      return (
        <CustomDataTableColumnHeader
          useStore={useWarehousesStore}
                    setSortType={setSortType}
          setSortBy={setSortBy}
          clearSortValue={clearSortValue}
          column={column}
          title={i18n.t("Name")}
          accessorKey={"name"}
        />
      );
    },
    accessorKey: "name",
  },
  {
    header: ({ column }) => {
      return (
        <CustomDataTableColumnHeader
          useStore={useWarehousesStore}
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
          useStore={useWarehousesStore}
                    setSortType={setSortType}
          setSortBy={setSortBy}
          clearSortValue={clearSortValue}
          column={column}
          title={i18n.t("latitude")}
          accessorKey={"latitude"}
        />
      );
    },
    accessorKey: "latitude",
  },
 
  {
     header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
];
