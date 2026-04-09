import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandle } from "./DragHandle";

import { TableCell, TableRow } from "../ui/table";
import { flexRender } from "@tanstack/react-table";
import { Link } from "react-router-dom";




export const DraggableTableRow = ({ row,canView,to }) => {
   
  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    isDragging
  } = useSortable({
    id: row.original.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition
  };
  return (
    <TableRow data-state={row.getIsSelected() && "selected"} ref={setNodeRef} style={style} >
      {isDragging ? (
        <p colSpan={row.getVisibleCells()?.length}></p>
      ) : (
        row.getVisibleCells()?.map((cell, i) => {
          if (i === 0) {
            return (
              <TableCell {...attributes} {...listeners} key={cell.id} >
                <div className="flex justify-start items-center space-x-2 w-full">
                    
                <DragHandle  />
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
  canView && i!==0 &&i!==row.getVisibleCells()?.length-1?
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
        })
      )}
    </TableRow>
  );
};
