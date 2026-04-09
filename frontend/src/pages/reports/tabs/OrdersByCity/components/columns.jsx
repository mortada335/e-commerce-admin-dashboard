// Component that displays the header section of a page with actions (e.g., buttons or filters)
import ActionsHeader from "@/components/layout/ActionsHeader";

// Cell component that renders action buttons (e.g., edit, delete) for each row in a table
import ActionsCell from "./ActionsCell";



// Custom column header component with sorting and optional filtering UI
import CustomDataTableColumnHeader from "@/components/data-table/custom-data-table-column-header";

// Store actions and hook from the bill-reports state store
import {
  clearSortValue,
  setSortBy,
  setSortType,
  useOrderByCityReportsStore,
} from "../store";

// UI components
import { Badge } from "@/components/ui/badge";
import Relation from "@/components/ui/relation";
import { customFormatDate } from "@/utils/methods";
import DataTableColumnHeader from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import i18n from "@/locales/i18n";



export default [



  {
    header: ({ table,column }) => {
      return <div className=" flex justify-start items-center gap-2 w-fit"> <Button
     
                      onClick={()=>table.getToggleAllRowsExpandedHandler()}
                 variant="ghost"
            size="icon"
            className='h-8 w-8 px-0 py-0'
            >
              {table.getIsAllRowsExpanded() ? '▼' : '▶'}
            </Button> 
            <DataTableColumnHeader
          column={column}
          title={i18n.t("name")}
          accessorKey={"name"}
        /></div>
    },
    accessorKey: "name",
    cell: ({ row, getValue }) => (
          <div
            style={{
              // Since rows are flattened by default,
              // we can use the row.depth property
              // and paddingLeft to visually indicate the depth
              // of the row
              paddingLeft: `${row.depth * 2}rem`,
            }}
          >
            <div>
            
              {row.getCanExpand() ? (
                <Button
                 onClick={()=>row.getToggleExpandedHandler()}
                                variant="ghost"
            size="icon"
            className='h-8 w-8 px-0 py-0'
            >
                
                  {row.getIsExpanded() ? '▼' : '▶'}
                </Button>
              ) : (
                <Button disabled={true} variant="ghost"
            size="icon"
            className='h-8 w-8 px-0 py-0'>

                🔵
                </Button>
              )}{' '}
              {i18n.t(getValue())}
            </div>
          </div>
        ),
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("order count")}
          accessorKey={"order_count"}
        />
      )
    },
    accessorKey: "order_count",
  },
  // {
  //   header: () => <ActionsHeader />,
  //   accessorKey: "actions",
  //   cell: ({ row }) => <ActionsCell item={row.original} />,
  // },
]; 