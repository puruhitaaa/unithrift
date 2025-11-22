"use client";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@unithrift/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@unithrift/ui/dropdown-menu";
import { Label } from "@unithrift/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@unithrift/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@unithrift/ui/table";
import { TableSkeleton } from "@unithrift/ui/table-skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  children?: React.ReactNode;
  // Enable server-side pagination and provide the server page count when in manual mode
  manualPagination?: boolean;
  pageCount?: number;
  // Controlled state (optional) for server-side mode
  controlledPageIndex?: number;
  controlledPageSize?: number;
  onPaginationChange?: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  controlledSorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  controlledColumnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  children,
  manualPagination = false,
  pageCount,
  controlledPageIndex,
  controlledPageSize,
  onPaginationChange,
  controlledSorting,
  onSortingChange,
  controlledColumnFilters,
  onColumnFiltersChange,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: controlledSorting ?? sorting,
      columnVisibility,
      rowSelection,
      columnFilters: controlledColumnFilters ?? columnFilters,
      pagination: {
        pageIndex: controlledPageIndex ?? pagination.pageIndex,
        pageSize: controlledPageSize ?? pagination.pageSize,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updater) => {
      const next: SortingState =
        typeof updater === "function"
          ? updater(table.getState().sorting)
          : updater;
      setSorting(next);
      if (onSortingChange) onSortingChange(next);
    },
    onColumnFiltersChange: (updater) => {
      const next: ColumnFiltersState =
        typeof updater === "function"
          ? updater(table.getState().columnFilters)
          : updater;
      setColumnFilters(next);
      if (onColumnFiltersChange) onColumnFiltersChange(next);
    },
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const prev = table.getState().pagination;
      const next = typeof updater === "function" ? updater(prev) : updater;
      setPagination(next);
      if (onPaginationChange)
        onPaginationChange({
          pageIndex: next.pageIndex,
          pageSize: next.pageSize,
        });
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    pageCount: manualPagination ? pageCount : undefined,
    manualPagination: !!manualPagination,
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">{children}</div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns className="mr-2 size-4" />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide(),
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <>
                <TableSkeleton
                  bodyOnly
                  columns={table.getVisibleLeafColumns().length}
                  rows={table.getState().pagination.pageSize}
                />
              </>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {manualPagination ? "—" : table.getFilteredRowModel().rows.length}{" "}
          row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1}{" "}
            {manualPagination
              ? pageCount
                ? `of ${pageCount}`
                : null
              : `of ${table.getPageCount()}`}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
