import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel, // ✅ Added
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React, { useMemo, useState } from "react";
import DataTablePagination from "../data-table/data-table-pagination";
import { Card } from "./card";
import { ScrollArea, ScrollBar } from "./scroll-area";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { StaticTableRow } from "../data-table/StaticTableRow";
import { DraggableTableRow } from "../data-table/DraggableTableRow";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

function DataTable({
  columns,
  data,
  defaultPagination = false,
  canView = false,
  to = "/",
  name = "",
  isDraggableTable = false,
  columnVisibility = {},
  setColumnVisibility = () => {},
}) {
  const [activeId, setActiveId] = useState();
  const [expanded, setExpanded] = useState({}); // ✅ Added expanded state
  const {t} = useTranslation()

  let rowModel;
  if (defaultPagination) {
    rowModel = getPaginationRowModel();
  } else {
    rowModel = getCoreRowModel();
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      expanded, // ✅ Keep track of expanded rows
    },
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded, // ✅ Handle expanded state changes
    getSubRows: row => row.areas,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: rowModel,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(), // ✅ Enable expanded rows
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd() {
    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  const selectedRow = useMemo(() => {
    if (!activeId) return null;
    return table
      .getRowModel()
      .rows?.find(({ original }) => original.id === activeId);
  }, [activeId, table]);

  return (
    <ScrollArea className="flex flex-col items-center justify-center gap-8 w-full">
      <Card className="w-full">
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          collisionDetection={closestCorners}
          modifiers={[restrictToVerticalAxis]}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead className="bg-[#eefff2] hover:bg-[#eefff2] text-[#2fad4f]" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody id={name}>
              {isDraggableTable ? (
                <SortableContext
                  items={data}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <React.Fragment key={row.original.id}>
                        <DraggableTableRow
                          canView={canView}
                          to={to}
                          row={row}
                        />
{row.getIsExpanded() &&
  row.original.areas?.map((area, idx) => (
    <TableRow key={`${row.id}-area-${idx}`} className="">
      {row.getVisibleCells().map((cell) => {
        // Get the column accessor key
        const colId = cell.column.id;

        // Match the sub-row's value to the parent column
        let value = area[colId] ?? "";

        return (
          <TableCell key={`${cell.id}-area-${idx}`}>
            {value}
          </TableCell>
        );
      })}
    </TableRow>
  ))}
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        {t("No results")}.
                      </TableCell>
                    </TableRow>
                  )}
                </SortableContext>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      onClick={row.getToggleExpandedHandler()} // ✅ Click to expand
                      className=""
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell className={cn('cursor-default',row.getCanExpand()?'cursor-pointer':'')} key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>

                 {row.getIsExpanded() &&
  row.original.areas?.map((area, idx) => (
    <TableRow key={`${row.id}-area-${idx}`} className="">
      {row.getVisibleCells().map((cell) => {
        // Get the column accessor key
        const colId = cell.column.id;

        // Match the sub-row's value to the parent column
        let value = area[colId] ?? "";

        return (
          <TableCell key={`${cell.id}-area-${idx}`}>
            {value}
          </TableCell>
        );
      })}
    </TableRow>
  ))}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {t("No results")}.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <DragOverlay>
            {activeId && (
              <table style={{ width: "100%" }}>
                <tbody>
                  <StaticTableRow canView={canView} to={to} row={selectedRow} />
                </tbody>
              </table>
            )}
          </DragOverlay>
        </DndContext>
      </Card>
      {defaultPagination && (
        <Card className="flex items-center justify-start space-x-2 py-1 px-0 mt-2 w-full">
          <DataTablePagination table={table} />
        </Card>
      )}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default DataTable;
