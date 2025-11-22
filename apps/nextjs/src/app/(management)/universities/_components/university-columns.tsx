"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

import { Button } from "@unithrift/ui/button";
import { Checkbox } from "@unithrift/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@unithrift/ui/dropdown-menu";

import { UniversityDeleteDialog } from "./university-delete-dialog";
import { UniversityFormDialog } from "./university-form-dialog";

export interface University {
  id: string;
  name: string;
  abbr: string;
  domain: string | null;
  logo: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

function ActionsCell({ university }: { university: University }) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <UniversityFormDialog
        open={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
        initialData={university}
      />
      <UniversityDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        university={university}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowUpdateDialog(true)}>
            <IconEdit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <IconTrash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export const columns: ColumnDef<University>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div
        role="button"
        className="flex cursor-pointer items-center gap-2 select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        {column.getIsSorted() === "asc" ? (
          <IconChevronUp className="h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <IconChevronDown className="h-3 w-3" />
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "abbr",
    header: "Abbreviation",
  },
  {
    accessorKey: "domain",
    header: "Domain",
    cell: ({ row }) => row.original.domain ?? "-",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div
        role="button"
        className="flex cursor-pointer items-center gap-2 select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
        {column.getIsSorted() === "asc" ? (
          <IconChevronUp className="h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <IconChevronDown className="h-3 w-3" />
        ) : null}
      </div>
    ),
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell university={row.original} />,
  },
];
