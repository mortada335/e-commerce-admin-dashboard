
import { Link } from "react-router-dom";
import { TableCell, TableRow } from "../ui/table";
import { DragHandle } from "./DragHandle";

import { flexRender } from "@tanstack/react-table";



export const StaticTableRow = ({ row ,canView ,to}) => {
  return (
    <TableRow data-state={row.getIsSelected() && "selected"} >
      {row.getVisibleCells()?.map((cell, i) => {
        if (i === 0) {
          return (
         
                <TableCell key={cell.id} >
                     <div className="flex justify-start items-center space-x-2 w-full">

                <DragHandle isDragging />
                {
flexRender(
cell.column.columnDef.cell,
cell.getContext()
)

}
                     </div>
              </TableCell>
          );
        }
        return (
            <TableCell key={cell.id} >
            {
 canView?
<Link    to={`${to}${row.original?.id}`}>
{flexRender(
 cell.column.columnDef.cell,
 cell.getContext()
)}
</Link>
: flexRender(
cell.column.columnDef.cell,
cell.getContext()
)

}
           </TableCell>
        );
      })}
    </TableRow>
  );
};
